import { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

export default function JournalPage() {
  const [mood, setMood] = useState("");

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-pink-100 px-6 pt-12">
        <Text className="text-3xl font-bold mb-2">Hi, Kelly.</Text>
        <Text className="text-lg text-gray-600">
          How are you feeling today?
        </Text>

        {/* Mood Buttons */}
        <View className="space-y-2">
          {moods.map((item) => (
            <Pressable
              key={item}
              onPress={() => setMood(item)}
              className={`rounded-full px-4 py-2 shadow ${
                mood === item ? "bg-orange-300" : "bg-white"
              }`}
            >
              <Text
                className={`${
                  mood === item ? "text-white font-medium" : "text-gray-800"
                }`}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Oranges */}
        <View className="items-center mb-6 mt-4">
          <Image
            source={moodToImage[mood]}
            className="w-32 h-32"
            resizeMode="contain"
          />
        </View>

        {/* Journal Title */}
        <Text className="text-lg font-semibold mb-2">MY JOURNAL</Text>

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
          <Text className="text-white font-semibold text-lg">Save</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}
