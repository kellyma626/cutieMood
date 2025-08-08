import { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase.js";

export default function JournalPage() {
  const router = useRouter();
  const [mood, setMood] = useState("pretty good");
  const [journalText, setJournalText] = useState("");
  const [selectedDate] = useState(new Date());
  const [isFocused, setIsFocused] = useState(false);

  const moods = [
    "super awesome",
    "pretty good",
    "okay",
    "pretty bad",
    "really terrible",
  ];

  const moodToImage: Record<string, any> = {
    "super awesome": require("@/assets/images/orange_happy.png"),
    "pretty good": require("@/assets/images/orange_smile.png"),
    okay: require("@/assets/images/orange_neutral.png"),
    "pretty bad": require("@/assets/images/orange_sad.png"),
    "really terrible": require("@/assets/images/orange_cry.png"),
  };

  const saveEntry = async () => {
    const { data, error } = await supabase
      .from("mood_entries")
      .insert([
        {
          date: selectedDate.toISOString().split("T")[0],
          mood: mood,
          journal_text: journalText,
        },
      ])
      .select();

    if (error) {
      console.error("Save failed:", error);
      alert("Oops! Something went wrong.");
    } else {
      console.log("Saved entry!", data);
      alert("Mood saved! 🍊");
      setJournalText("");
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={[global.cutie.gradientStart, global.cutie.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            {isFocused ? (
              <View className="flex-1 bg-white">
                <Pressable
                  onPress={() => {
                    setIsFocused(false);
                    Keyboard.dismiss();
                  }}
                  className="absolute top-20 right-10 z-10"
                >
                  <AntDesign name="close" size={28} color="#9CA3AF" />
                </Pressable>

                <View className="flex-1">
                  <Text className="font-nunito-bold text-2xl text-gray-700 mt-20 mb-2 uppercase ml-8">
                    My Journal
                  </Text>

                  <TextInput
                    autoFocus
                    placeholder="Type your thoughts here..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    value={journalText}
                    onChangeText={setJournalText}
                    className="flex-1 text-gray-800 p-4 mx-4 rounded-xl text-lg font-nunito text-top"
                  />
                </View>
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
              >
                <View className="flex-1">
                  <View className="mx-8">
                    <Pressable
                      onPress={() => router.back()}
                      className="absolute top-20 z-10"
                    >
                      <AntDesign
                        name="left"
                        size={30}
                        color={global.cutie.pink}
                      />
                    </Pressable>

                    <View className="mt-36">
                      <Text className="text-5xl pt-5 font-nunito-bold mb-1">
                        Hi, Kelly.
                      </Text>
                      <Text className="text-xl text-gray-500 font-nunito">
                        How are you feeling today?
                      </Text>
                    </View>

                    <View className="flex-row justify-between mt-10">
                      <View>
                        {moods.map((item, index) => (
                          <Pressable
                            key={item}
                            onPress={() => setMood(item)}
                            style={{
                              backgroundColor:
                                mood === item
                                  ? item === "super awesome"
                                    ? global.cutie.pink
                                    : item === "pretty good"
                                      ? global.cutie.orange
                                      : item === "okay"
                                        ? global.cutie.green
                                        : item === "pretty bad"
                                          ? global.cutie.blue
                                          : global.cutie.purple
                                  : "white",
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 9999,
                              marginBottom: index !== moods.length - 1 ? 12 : 0,
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: 0.1,
                              shadowRadius: 2,
                              elevation: 1,
                            }}
                          >
                            <Text
                              className={`font-nunito-bold ${
                                mood === item ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {item}
                            </Text>
                          </Pressable>
                        ))}
                      </View>

                      <View className="items-center w-1/2">
                        <Image
                          source={moodToImage[mood]}
                          className="w-[200px] h-[200px]"
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  </View>

                  <View className="bg-white rounded-3xl border border-gray-200 mt-6 px-6 py-6 shadow-sm elevation-3 h-full">
                    <View className="h-1 w-16 bg-gray-300 rounded-full self-center mb-4" />

                    <Text className="text-gray-700 mb-2 text-xl ml-3 uppercase font-nunito-bold">
                      My Journal
                    </Text>

                    <TextInput
                      placeholder="Type your thoughts here..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      value={journalText}
                      onChangeText={setJournalText}
                      onFocus={() => setIsFocused(true)}
                      className="text-gray-800 p-4 rounded-xl text-base font-normal min-h-[180px] max-h-[300px] text-top"
                    />

                    <Pressable
                      onPress={saveEntry}
                      className="py-3 rounded-full items-center mt-6 shadow-md elevation-2 bg-cutie-orange"
                    >
                      <Text className="text-white font-lg font-nunito-bold">
                        Save
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
