import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";
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

// Helper function to reformat date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EntryViewPage() {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const [entry, setEntry] = useState<any>(undefined); // undefined = loading, null = no data

  useEffect(() => {
    const fetchEntry = async () => {
      if (!date) {
        console.warn("No date param provided!");
        setEntry(null);
        return;
      }

      const { data, error } = await supabase
        .from("mood_entries")
        .select()
        .eq("date", date)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Fetch error:", error);
        setEntry(null);
      } else {
        setEntry(data);
      }
    };

    fetchEntry();
  }, [date]);

  if (entry === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="font-nunito-bold text-gray-600 text-xl">
          Loading entry...
        </Text>
      </View>
    );
  }

  if (entry === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="font-nunito-bold text-gray-600 mb-6 text-xl text-center">
          No entry found for {date ?? "this date"}.
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

  const moodColor = moodToColor[entry.mood] || "bg-gray-200";

  return (
    <LinearGradient
      colors={[global.cutie.gradientStart, global.cutie.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1 px-6 pt-24 pb-10">
        {/* Date */}
        <Text className="text-4xl font-nunito-bold mb-4 text-gray-700">
          {formatDate(entry.date)}
        </Text>

        {/* Mood block and Orange image overlapping */}
        <View className="relative mb-12">
          <View className={`w-full rounded-2xl py-6 px-6 pr-36 ${moodColor}`}>
            <Text className="text-4xl font-nunito-bold text-white">
              {entry.mood}
            </Text>
          </View>

          {/* Orange image floating across both blocks */}
          <Image
            source={moodToImage[entry.mood]}
            className="w-28 h-28 absolute -right-1 top-5 z-10"
            resizeMode="contain"
          />
        </View>

        {/* Journal box */}
        <View className="bg-gray-100 rounded-2xl p-6 -mt-5 mb-8">
          <Text className="text-xl font-nunito text-gray-800 leading-relaxed">
            {entry.journal_text}
          </Text>
        </View>

        {/* Done button */}
        <Pressable
          onPress={() => router.back()}
          className="bg-cutie-pink py-4 rounded-full items-center shadow"
        >
          <Text className="text-white font-semibold text-xl font-nunito-bold">
            Done
          </Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
