import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
  Modal,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import type { ViewToken, ViewabilityConfig } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase.js";
// near the top of the file, after constants
const JOURNAL_MAX_HEIGHT = 280; // tweak to taste

// Mood image mapping
const moodToImage: Record<string, any> = {
  "super awesome": require("@/assets/images/orange_happy.png"),
  "pretty good": require("@/assets/images/orange_smile.png"),
  okay: require("@/assets/images/orange_neutral.png"),
  "pretty bad": require("@/assets/images/orange_sad.png"),
  "really terrible": require("@/assets/images/orange_cry.png"),
};

// Mood color mapping
const moodToColor: Record<string, string> = {
  "super awesome": "bg-cutie-pink",
  "pretty good": "bg-cutie-orange",
  okay: "bg-cutie-green",
  "pretty bad": "bg-cutie-blue",
  "really terrible": "bg-cutie-purple",
};

const ALL_MOODS = [
  "super awesome",
  "pretty good",
  "okay",
  "pretty bad",
  "really terrible",
] as const;

type MoodType = (typeof ALL_MOODS)[number];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function preview(text: string | null | undefined, len = 60) {
  if (!text) return "";
  return text.length > len ? text.slice(0, len - 1) + "…" : text;
}

export default function EntryViewPage() {
  const router = useRouter();
  const { date } = useLocalSearchParams();

  const [entries, setEntries] = useState<any[] | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState(0);
  const entry = useMemo(
    () => (entries && entries.length ? entries[currentIndex] : null),
    [entries, currentIndex],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");

  // Mood picker modal
  const [moodPickerOpen, setMoodPickerOpen] = useState(false);

  // Full-screen text editor
  const [fullEditorOpen, setFullEditorOpen] = useState(false);

  // Modal for history list
  const [historyOpen, setHistoryOpen] = useState(false);

  // Horizontal pager sizing + ref for jumping to index
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  const listRef = useRef<FlatList<any>>(null);

  // Keep currentIndex in a ref so the stable viewability callback can read it
  const currentIndexRef = useRef(0);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Close mood picker if we leave edit mode
  useEffect(() => {
    if (!isEditing && moodPickerOpen) setMoodPickerOpen(false);
  }, [isEditing, moodPickerOpen]);

  // Also close full-screen editor if we leave edit mode
  useEffect(() => {
    if (!isEditing && fullEditorOpen) setFullEditorOpen(false);
  }, [isEditing, fullEditorOpen]);

  // Swipe-down close for history sheet
  const panHistory = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        const dy = Math.abs(g.dy);
        const dx = Math.abs(g.dx);
        return dy > 8 && dy > dx; // mostly vertical
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80 || g.vy > 0.8) setHistoryOpen(false);
      },
    }),
  ).current;

  useEffect(() => {
    const fetchEntries = async () => {
      if (!date) {
        console.warn("No date param provided!");
        setEntries([]);
        return;
      }

      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("date", date)
        .order("id", { ascending: false }); // newest first

      if (error) {
        console.error("Fetch error:", error);
        setEntries([]);
      } else {
        setEntries(data || []);
        setCurrentIndex(0);
      }
    };

    fetchEntries();
  }, [date]);

  const handleSave = async () => {
    if (!entry) return;
    const { error } = await supabase
      .from("mood_entries")
      .update({ journal_text: editedText })
      .eq("id", entry.id);

    if (error) {
      console.error("Update failed:", error);
      Alert.alert("Failed to save changes.");
    } else {
      setEntries((prev) => {
        if (!prev) return prev;
        const copy = [...prev];
        copy[currentIndex] = {
          ...copy[currentIndex],
          journal_text: editedText,
        };
        return copy;
      });
      setIsEditing(false);
      Alert.alert("Entry saved!");
    }
  };

  const handleUpdateMood = async (newMood: MoodType) => {
    if (!entry) return;
    const { error } = await supabase
      .from("mood_entries")
      .update({ mood: newMood })
      .eq("id", entry.id);

    if (error) {
      console.error("Mood update failed:", error);
      Alert.alert("Failed to update mood.");
    } else {
      setEntries((prev) => {
        if (!prev) return prev;
        const copy = [...prev];
        copy[currentIndex] = {
          ...copy[currentIndex],
          mood: newMood,
        };
        return copy;
      });
      setMoodPickerOpen(false);
    }
  };

  // ---- Delete: split into a helper + wrapper so we can reuse with/without confirm
  const doDelete = async () => {
    if (!entry) return;

    const { error } = await supabase
      .from("mood_entries")
      .delete()
      .eq("id", entry.id);

    if (error) {
      console.error("Delete failed:", error);
      Alert.alert("Failed to delete entry.");
      return;
    }

    setEntries((prev) => {
      if (!prev) return prev;
      const next = prev.filter((e) => e.id !== entry.id);

      const newIndex = Math.max(
        0,
        Math.min(currentIndexRef.current, next.length - 1),
      );
      setCurrentIndex(newIndex);

      if (next.length === 0) {
        router.back();
      }
      return next;
    });

    setIsEditing(false);
    setFullEditorOpen(false);
    Alert.alert("Entry deleted.");
  };

  const handleDelete = (skipConfirm = false) => {
    if (skipConfirm) {
      doDelete();
      return;
    }
    Alert.alert(
      "Delete this entry?",
      "This can’t be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: doDelete },
      ],
      { cancelable: true },
    );
  };

  // ---- Viewability (typed + stable) ----
  const viewabilityConfigRef = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 60,
  });

  const onViewableItemsChanged = useRef(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const idx = info.viewableItems[0]?.index;
      if (typeof idx === "number" && idx !== currentIndexRef.current) {
        setCurrentIndex(idx);
        setIsEditing(false);
      }
    },
  ).current;

  // Fallback: also update at momentum end
  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!pageWidth) return;
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / pageWidth);
    if (index !== currentIndexRef.current) {
      setCurrentIndex(index);
      setIsEditing(false);
    }
  };

  // Set page width from layout
  const onLayout = (e: LayoutChangeEvent) => {
    setPageWidth(e.nativeEvent.layout.width);
  };

  if (entries === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="font-nunito-bold text-gray-600 text-xl">
          Loading entries...
        </Text>
      </View>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="font-nunito-bold text-gray-600 mb-6 text-xl text-center">
          No entries found for {date ?? "this date"}.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-cutie-orange py-4 px-10 rounded-full shadow"
        >
          <Text className="text-white font-nunito-bold text-xl">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const moreCount = Math.max(entries.length - 1, 0);

  return (
    <LinearGradient
      colors={[global.cutie.gradientStart, global.cutie.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View className="px-6 pt-24">
        <View className="items-center justify-between mb-4">
          <Text className="text-5xl pt-2 font-nunito-bold text-gray-700">
            {formatDate(entries[0].date)}
          </Text>
        </View>

        <View className="flex-row justify-between">
          {entries.length > 1 && (
            <Text className="text-gray-600 mb-3 font-nunito text-xl">
              Entries {currentIndex + 1} of {entries.length}
            </Text>
          )}
          {moreCount > 0 && (
            <Pressable
              onPress={() => setHistoryOpen(true)}
              className="bg-white/70 border border-white/60 rounded-full px-4 py-2"
            >
              <Text className="font-nunito-bold text-gray-700">History</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Horizontal pager */}
      <View className="flex-1" onLayout={onLayout}>
        <FlatList
          ref={listRef}
          data={entries}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => String(item.id)}
          onMomentumScrollEnd={onMomentumEnd}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfigRef.current}
          removeClippedSubviews={false}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={5}
          getItemLayout={
            pageWidth
              ? (_: any, index: number) => ({
                  length: pageWidth,
                  offset: pageWidth * index,
                  index,
                })
              : undefined
          }
          renderItem={({ item }) => {
            const moodColor =
              moodToColor[item.mood as keyof typeof moodToColor] ||
              "bg-gray-200";
            const isCurrent = item.id === entries[currentIndex].id;

            return (
              <View
                style={{ width: pageWidth ?? "100%" }}
                className="px-6 pb-10 relative"
              >
                {/* Tangerine image pinned to the very top-right of the card */}
                <Image
                  source={moodToImage[item.mood]}
                  className="w-28 h-28 absolute right-4 top-16 z-20"
                  resizeMode="contain"
                />

                {/* Mood block (tap only in edit mode) */}
                <Pressable
                  disabled={!isCurrent || !isEditing}
                  onPress={() => setMoodPickerOpen(true)}
                  className="relative mb-12 mt-14"
                >
                  <View
                    className={`w-full rounded-2xl py-6 px-6 pr-36 ${moodColor}`}
                  >
                    <Text className="text-3xl font-nunito-bold text-white">
                      {item.mood}
                    </Text>
                    {isCurrent && isEditing && (
                      <Text className="text-white/90 font-nunito mt-1">
                        Tap to change mood
                      </Text>
                    )}
                  </View>

                  {/* Subtle overlay when not current */}
                  {!isCurrent && (
                    <View className="absolute inset-0 rounded-2xl bg-black/5" />
                  )}
                </Pressable>

                {/* Journal box */}
                <View className="bg-gray-100 rounded-2xl p-6 -mt-5 mb-4">
                  {isEditing && isCurrent ? (
                    <View>
                      <Text className="text-gray-500 font-nunito mb-2">
                        Editing — tap to edit
                      </Text>

                      <TextInput
                        multiline
                        scrollEnabled
                        value={editedText}
                        onChangeText={setEditedText}
                        onFocus={() => setFullEditorOpen(true)}
                        placeholder="Type your thoughts here…"
                        placeholderTextColor="#9CA3AF"
                        textAlignVertical="top"
                        style={{ maxHeight: JOURNAL_MAX_HEIGHT }}
                        className="text-xl font-nunito text-gray-800 leading-relaxed min-h-[120px]"
                      />
                    </View>
                  ) : (
                    <ScrollView
                      style={{ maxHeight: JOURNAL_MAX_HEIGHT }}
                      nestedScrollEnabled
                      showsVerticalScrollIndicator
                      keyboardShouldPersistTaps="handled"
                    >
                      <Text className="text-xl font-nunito text-gray-800 leading-relaxed">
                        {item.journal_text}
                      </Text>
                    </ScrollView>
                  )}
                </View>

                {/* ACTIONS */}
                <View className="space-y-4 gap-y-4">
                  {!isEditing ? (
                    <>
                      <Pressable
                        disabled={!isCurrent}
                        onPress={() => {
                          setEditedText(item.journal_text ?? "");
                          setIsEditing(true); // DO NOT open full-screen here
                        }}
                        className={`bg-cutie-green py-4 rounded-full items-center shadow ${
                          isCurrent ? "" : "opacity-40"
                        }`}
                      >
                        <Text className="text-white font-nunito-bold text-xl">
                          Edit Entry
                        </Text>
                      </Pressable>

                      <Pressable
                        disabled={!isCurrent}
                        onPress={() => router.back()}
                        className={`bg-cutie-pink py-4 rounded-full items-center shadow ${
                          isCurrent ? "" : "opacity-40"
                        }`}
                      >
                        <Text className="text-white font-nunito-bold text-xl">
                          Done
                        </Text>
                      </Pressable>
                    </>
                  ) : (
                    <>
                      {/* Save (tap) / Delete (long-press) */}
                      <Pressable
                        disabled={!isCurrent}
                        onPress={handleSave}
                        onLongPress={() => {
                          Alert.alert(
                            "Hold detected",
                            "Delete this entry? This can’t be undone.",
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Delete",
                                style: "destructive",
                                onPress: () => handleDelete(true),
                              },
                            ],
                          );
                        }}
                        delayLongPress={600}
                        className={`bg-cutie-green py-4 rounded-full items-center shadow ${
                          isCurrent ? "" : "opacity-40"
                        }`}
                      >
                        <Text className="text-white font-nunito-bold text-xl">
                          Save Changes
                        </Text>
                        <Text className="text-white/80 font-nunito text-sm mt-1">
                          Long-press to delete
                        </Text>
                      </Pressable>

                      <Pressable
                        disabled={!isCurrent}
                        onPress={() => {
                          setIsEditing(false);
                          setFullEditorOpen(false); // safety close
                        }}
                        className={`bg-cutie-pink py-4 rounded-full items-center shadow ${
                          isCurrent ? "" : "opacity-40"
                        }`}
                      >
                        <Text className="text-white font-nunito-bold text-xl">
                          Cancel
                        </Text>
                      </Pressable>
                    </>
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* Mood picker modal */}
      <Modal
        visible={moodPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMoodPickerOpen(false)}
      >
        <View className="flex-1 items-center justify-center">
          {/* Backdrop */}
          <Pressable
            onPress={() => setMoodPickerOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Card */}
          <View className="bg-white w-[88%] rounded-3xl p-6">
            <Text className="text-2xl font-nunito-bold text-gray-800 mb-4">
              Select your mood
            </Text>

            <View className="gap-y-3">
              {ALL_MOODS.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => handleUpdateMood(m)}
                  className="flex-row items-center justify-between px-4 py-3 rounded-2xl bg-gray-50"
                >
                  <View className="flex-row items-center gap-x-3">
                    <Image
                      source={moodToImage[m]}
                      className="w-9 h-9"
                      resizeMode="contain"
                    />
                    <Text className="text-lg font-nunito text-gray-800">
                      {m}
                    </Text>
                  </View>

                  {/* Selected check */}
                  {entry?.mood === m ? (
                    <View className="w-6 h-6 rounded-full bg-cutie-green" />
                  ) : (
                    <View className="w-6 h-6 rounded-full border border-gray-300" />
                  )}
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => setMoodPickerOpen(false)}
              className="mt-5 bg-gray-200 py-3 rounded-2xl items-center"
            >
              <Text className="font-nunito-bold text-gray-700 text-lg">
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* FULL-SCREEN TEXT EDITOR */}
      <Modal
        visible={fullEditorOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setFullEditorOpen(false)}
      >
        <View className="flex-1 bg-white">
          {/* Top bar */}
          <View className="flex-row items-center justify-between px-5 pt-14 pb-3 border-b border-gray-200">
            <Pressable
              onPress={() => {
                setFullEditorOpen(false);
                // Keep isEditing true; user can still save/cancel via main buttons.
              }}
              className="px-3 py-2"
            >
              <Text className="font-nunito-bold text-gray-700 text-lg">
                Close
              </Text>
            </Pressable>

            <Text className="font-nunito-bold text-gray-800 text-lg">
              Edit Entry
            </Text>

            <Pressable
              onPress={async () => {
                await handleSave();
                setFullEditorOpen(false);
              }}
              className="px-3 py-2"
            >
              <Text className="font-nunito-bold text-cutie-green text-lg">
                Save
              </Text>
            </Pressable>
          </View>

          {/* Editor body */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <View className="flex-1 p-5">
              <TextInput
                autoFocus
                multiline
                value={editedText}
                onChangeText={setEditedText}
                textAlignVertical="top"
                placeholder="Write your thoughts…"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-[18px] font-nunito text-gray-800 leading-relaxed"
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* History picker modal */}
      <Modal
        visible={historyOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setHistoryOpen(false)}
      >
        <View className="flex-1 justify-end">
          {/* Backdrop: tap outside to close */}
          <Pressable
            onPress={() => setHistoryOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Bottom sheet */}
          <View
            {...panHistory.panHandlers}
            className="bg-white rounded-t-3xl p-6 max-h-[70%]"
          >
            {/* Grab handle */}
            <View className="items-center mb-3">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-2xl font-nunito-bold text-gray-800">
                Entries for {entry ? formatDate(entry.date) : ""}
              </Text>
              <Pressable
                onPress={() => setHistoryOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-full"
              >
                <Text className="font-nunito-bold text-gray-700">Close</Text>
              </Pressable>
            </View>

            <FlatList
              data={entries}
              keyExtractor={(item) => String(item.id)}
              ItemSeparatorComponent={() => (
                <View className="h-[1px] bg-gray-200" />
              )}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    setHistoryOpen(false);
                    setIsEditing(false);
                    setCurrentIndex(index);
                    if (listRef.current && pageWidth) {
                      listRef.current.scrollToIndex({ index, animated: true });
                    }
                  }}
                  className={`py-3 px-2 rounded-xl ${
                    index === currentIndex ? "bg-gray-100" : ""
                  }`}
                >
                  <Text className="font-nunito-bold text-gray-800">
                    {index === 0 ? "Latest" : `Mood #${index}`} • {item.mood}
                  </Text>
                  <Text className="text-gray-600 font-nunito mt-1">
                    {preview(item.journal_text)}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
