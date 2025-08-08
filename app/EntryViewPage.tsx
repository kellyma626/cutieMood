import {
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
} from "react-native";
import type { ViewToken, ViewabilityConfig } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase.js";

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
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-4xl font-nunito-bold text-gray-700">
            {formatDate(entries[0].date)}
          </Text>

          {moreCount > 0 && (
            <Pressable
              onPress={() => setHistoryOpen(true)}
              className="bg-white/70 border border-white/60 rounded-full px-4 py-2"
            >
              <Text className="font-nunito-bold text-gray-700">History</Text>
            </Pressable>
          )}
        </View>

        {entries.length > 1 && (
          <Text className="text-gray-600 mb-3 font-nunito">
            Entries {currentIndex + 1} of {entries.length}
          </Text>
        )}
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
          // Pre-render neighbors so buttons are ready
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
                className="px-6 pb-10"
              >
                {/* Mood block + emoji */}
                <View className="relative mb-12 mt-2">
                  <View
                    className={`w-full rounded-2xl py-6 px-6 pr-36 ${moodColor}`}
                  >
                    <Text className="text-4xl font-nunito-bold text-white">
                      {item.mood}
                    </Text>
                  </View>
                  <Image
                    source={moodToImage[item.mood]}
                    className="w-28 h-28 absolute -right-1 top-5 z-10"
                    resizeMode="contain"
                  />
                </View>

                {/* Journal box */}
                <View className="bg-gray-100 rounded-2xl p-6 -mt-5 mb-8">
                  {isEditing && isCurrent ? (
                    <TextInput
                      multiline
                      value={editedText}
                      onChangeText={setEditedText}
                      className="text-xl font-nunito text-gray-800 leading-relaxed min-h-[180px] max-h-[300px] text-top"
                    />
                  ) : (
                    <Text className="text-xl font-nunito text-gray-800 leading-relaxed">
                      {item.journal_text}
                    </Text>
                  )}
                </View>

                {/* ACTIONS: always mounted; dim when not current (no color swap) */}
                <View className="space-y-4 gap-y-8">
                  {!isEditing ? (
                    <>
                      <Pressable
                        disabled={!isCurrent}
                        onPress={() => {
                          setEditedText(item.journal_text ?? "");
                          setIsEditing(true);
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
                      <Pressable
                        disabled={!isCurrent}
                        onPress={handleSave}
                        className={`bg-cutie-green py-4 rounded-full items-center shadow ${
                          isCurrent ? "" : "opacity-40"
                        }`}
                      >
                        <Text className="text-white font-nunito-bold text-xl">
                          Save Changes
                        </Text>
                      </Pressable>

                      <Pressable
                        disabled={!isCurrent}
                        onPress={() => setIsEditing(false)}
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
