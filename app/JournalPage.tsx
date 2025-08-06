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

export default function JournalPage() {
  const [mood, setMood] = useState("pretty good");

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

  const [journalText, setJournalText] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1 bg-rose-100 px-10 pt-28">
            <Text className="text-4xl font-nunito-bold mb-2">Hi, Kelly.</Text>
            <Text className="text-lg text-gray-600 font-nunito">
              How are you feeling today?
            </Text>

            <View className="flex-row justify-between items-start mt-10 mb-6 mr-5">
              {/* Mood Buttons Column */}
              <View>
                {moods.map((item, index) => (
                  <Pressable
                    key={item}
                    onPress={() => setMood(item)}
                    className={`rounded-full px-4 py-2 shadow ${
                      mood === item
                        ? item === "super awesome"
                          ? "bg-rose-400"
                          : item === "pretty good"
                          ? "bg-orange-400"
                          : item === "okay"
                          ? "bg-teal-600"
                          : item === "pretty bad"
                          ? "bg-cyan-700"
                          : item === "really terrible"
                          ? "bg-slate-700"
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

              {/* Orange Image */}
              <View className="items-center w-1/2">
                <Image
                  source={moodToImage[mood]}
                  className="w-60 h-60"
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Journal Title */}
            <Text className="text-lg font-semibold mb-2 mt-10 font-nunito-bold">
             My Journal
            </Text>

            {/* Journal Input Box */}
            <TextInput
              placeholder="type here..."
              multiline
              value={journalText}
              onChangeText={setJournalText}
              className="bg-white p-4 rounded-lg h-40 text-base text-gray-800"
            />

            {/* Save Button */}
            <Pressable className="bg-orange-400 mt-6 py-3 rounded-full items-center shadow">
              <Text className="text-white font-semibold text-lg font-nunito-bold">
                Save
              </Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}