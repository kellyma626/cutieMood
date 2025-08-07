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
import { supabase } from "../lib/supabase";

export default function JournalPage() {
  const router = useRouter();
  const [mood, setMood] = useState("pretty good");
  const [journalText, setJournalText] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const moods = [
    "super awesome",
    "pretty good",
    "okay",
    "pretty bad",
    "really terrible",
  ];

  const moodToImage: Record<string, any> = {
    "super awesome": require("../assets/images/orange_happy.png"),
    "pretty good": require("../assets/images/orange_smile.png"),
    okay: require("../assets/images/orange_neutral.png"),
    "pretty bad": require("../assets/images/orange_sad.png"),
    "really terrible": require("../assets/images/orange_cry.png"),
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1">
            <Pressable
              onPress={() => router.back()}
              className="absolute top-20 left-6 z-10"
            >
              <AntDesign name="left" size={30} color={global.cutie.pink} />
            </Pressable>

            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="px-10 pt-36 pb-6">
                <Text className="text-4xl font-nunito-bold mb-2">
                  Hi, Kelly.
                </Text>
                <Text className="text-lg text-gray-600 font-nunito">
                  How are you feeling today?
                </Text>

                <View className="flex-row justify-between items-start mt-10 mr-5">
                  <View>
                    {moods.map((item, index) => (
                      <Pressable
                        key={item}
                        onPress={() => setMood(item)}
                        className={`rounded-full px-4 py-2 shadow ${
                          mood === item
                            ? item === "super awesome"
                              ? "bg-cutie-pink"
                              : item === "pretty good"
                                ? "bg-cutie-orange"
                                : item === "okay"
                                  ? "bg-cutie-green"
                                  : item === "pretty bad"
                                    ? "bg-cutie-blue"
                                    : item === "really terrible"
                                      ? "bg-cutie-purple"
                                      : "bg-gray-400"
                            : "bg-white"
                        } ${index !== moods.length - 1 ? "mb-3" : ""}`}
                      >
                        <Text
                          className={`${
                            mood === item
                              ? "text-white font-nunito-bold"
                              : "text-gray-800 font-nunito-bold"
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
                      className="w-60 h-60"
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
              <View className="bg-white rounded-t-3xl shadow border-t border-gray-200 flex-1">
                <View className="h-1 bg-gray-300 w-16 self-center mt-3 rounded-full" />
                <Text className="text-gray-700 font-nunito-bold mt-4 mb-2 ml-6 uppercase">
                  My Journal
                </Text>
                <TextInput
                  placeholder="type here..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  value={journalText}
                  onChangeText={setJournalText}
                  className="px-6 pt-2 pb-6 text-base text-gray-800 font-nunito"
                  style={{
                    textAlignVertical: "top",
                    minHeight: 200,
                  }}
                />
                <Pressable
                  onPress={saveEntry}
                  className="bg-cutie-orange py-3 rounded-full items-center shadow mx-6 translate-y-10"
                >
                  <Text className="text-white font-semibold text-lg font-nunito-bold">
                    Save
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
