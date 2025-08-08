import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

// Mood legend (for display only)
const legend = [
  { label: "super awesome", color: "bg-cutie-pink" },
  { label: "pretty good", color: "bg-cutie-orange" },
  { label: "okay", color: "bg-cutie-green" },
  { label: "pretty bad", color: "bg-cutie-blue" },
  { label: "really terrible", color: "bg-cutie-purple" },
];

// Map mood strings to tailwind bg classes
const moodToColor: Record<string, string> = {
  "super awesome": "bg-cutie-pink",
  "pretty good": "bg-cutie-orange",
  okay: "bg-cutie-green",
  "pretty bad": "bg-cutie-blue",
  "really terrible": "bg-cutie-purple",
};

export default function Index() {
  const [moodMap, setMoodMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMoods = async () => {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("date, mood");
      if (error) {
        console.error("Error fetching mood entries:", error);
        return;
      }

      const map: Record<string, string> = {};
      data.forEach((entry: any) => {
        map[entry.date] = entry.mood;
      });
      setMoodMap(map);
    };

    fetchMoods();
  }, []);

  async function onDayPress(dateString: string) {
    const { data, error } = await supabase
      .from("mood_entries")
      .select("id")
      .eq("date", dateString)
      .order("id", { ascending: true }) // 👈 Higher ID = more recent
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.warn("No mood entry found for", dateString, "Error:", error);
      return;
    }

    router.push({
      pathname: "/EntryViewPage",
      params: {
        date: dateString,
        id: data.id.toString(), // pass as string if needed for URL
      },
    });
  }

  return (
    <View className="flex-1 items-center bg-white h-full w-full">
      <View className="w-[90%] rounded-2xl overflow-hidden bg-white shadow-xl">
        <Calendar
          current={new Date().toISOString().split("T")[0]}
          markingType={"custom"}
          enableSwipeMonths={true}
          dayComponent={({ date, state }) => {
            const day = date?.day ?? "";
            const dateString = date?.dateString;
            const isDisabled = state === "disabled";

            const mood = dateString && moodMap[dateString];
            const moodBg = mood
              ? moodToColor[mood] || "bg-gray-200"
              : "bg-gray-200";
            const textColor = isDisabled
              ? "text-gray-400"
              : mood
                ? "text-white"
                : "text-gray-800";

            const baseCircle =
              "h-10 w-10 rounded-full justify-center items-center";

            return (
              <TouchableOpacity
                disabled={isDisabled}
                onPress={() => {
                  if (dateString) onDayPress(dateString);
                }}
              >
                <View
                  className={`${baseCircle} ${moodBg} ${
                    isDisabled ? "opacity-30" : ""
                  }`}
                >
                  <Text className={`font-nunito-medium ${textColor}`}>
                    {day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#333",
            arrowColor: "gray",
            monthTextColor: "#000",
            textMonthFontWeight: "bold",
            textMonthFontSize: 32,
            textMonthFontFamily: "Nunito_700Bold",
            textDayHeaderFontWeight: "400",
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      {/* Legend */}
      <View className="w-full px-9 mt-3">
        {legend.map((item, idx) => (
          <View key={idx} className="flex-row items-center mb-2">
            <View className={`w-6 aspect-square rounded-md ${item.color}`} />
            <Text className="ml-2 font-nunito-bold">{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
