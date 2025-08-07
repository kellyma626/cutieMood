import React from "react";
import { Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

type MoodType = "pink" | "orange" | "green" | "blue" | "purple";

type MarkedDatesType = {
  [date: string]: { mood: MoodType };
};

const legend = [
  { label: "super awesome", color: "bg-cutie-pink", value: "pink" },
  { label: "pretty good", color: "bg-cutie-orange", value: "orange" },
  { label: "okay", color: "bg-cutie-green", value: "green" },
  { label: "pretty bad", color: "bg-cutie-blue", value: "blue" },
  { label: "really terrible", color: "bg-cutie-purple", value: "purple" },
];

const markedDates: MarkedDatesType = {
  "2025-11-01": { mood: "orange" },
  "2025-11-02": { mood: "pink" },
  "2025-11-03": { mood: "green" },
  "2025-11-04": { mood: "blue" },
  "2025-11-05": { mood: "orange" },
  "2025-11-06": { mood: "pink" },
  "2025-11-07": { mood: "pink" },
  "2025-11-08": { mood: "pink" },
  "2025-11-09": { mood: "orange" },
  "2025-11-10": { mood: "pink" },
  "2025-11-11": { mood: "blue" },
  "2025-11-12": { mood: "blue" },
  "2025-11-13": { mood: "orange" },
  "2025-11-14": { mood: "pink" },
  "2025-11-15": { mood: "green" },
  "2025-11-16": { mood: "blue" },
  "2025-11-17": { mood: "purple" },
};

export default function Index() {
  return (
    <View className="flex-1 items-center bg-white h-full w-full">
      <View className="w-[90%] rounded-2xl overflow-hidden bg-white shadow-xl">
        <Calendar
          current={"2025-11-01"}
          markingType={"custom"}
          dayComponent={({ date, state }) => {
            const dateString = date?.dateString;
            const day = date?.day ?? "";
            const isDisabled = state === "disabled";
            const moodData = markedDates[dateString || ""];
            const moodColor = moodData?.mood;

            const baseCircle =
              "h-10 w-10 rounded-full justify-center items-center";
            const defaultCircle = "bg-gray-200";
            const selectedCircle = moodColor
              ? `bg-cutie-${moodColor}`
              : defaultCircle;

            const textColor = isDisabled
              ? "text-gray-400"
              : moodColor
                ? "text-white"
                : "text-gray-800";

            return (
              <View
                className={`${baseCircle} ${selectedCircle} ${isDisabled ? "opacity-30" : ""}`}
              >
                <Text className={`font-semibold ${textColor}`}>{day}</Text>
              </View>
            );
          }}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#333",
            arrowColor: "gray",
            monthTextColor: "#000",
            textMonthFontWeight: "bold",
            textMonthFontSize: 24,
            textDayHeaderFontWeight: "600",
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      <View className="w-full px-9 mt-3">
        {legend.map((item, idx) => (
          <View key={idx} className="flex-row items-center mb-2">
            <View className={`w-6 aspect-square rounded-md ${item.color}`} />
            <Text className="ml-2 font-semibold">{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
