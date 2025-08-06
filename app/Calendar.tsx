import { Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const legend = [
  { label: "super awesome", color: "bg-red-300" },
  { label: "pretty good", color: "bg-orange-300" },
  { label: "okay", color: "bg-green-300" },
  { label: "pretty bad", color: "bg-blue-300" },
  { label: "really terrible", color: "bg-purple-300" },
];

export default function Index() {
  const totalDays = 30;
  const firstDayIndex = 3;

  const startBlanks = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  let calendarSlots = [...startBlanks, ...days];
  const endBlanks = (7 - (calendarSlots.length % 7)) % 7;
  calendarSlots = [...calendarSlots, ...Array(endBlanks).fill(null)];

  return (
    <View className="flex-1 items-center bg-white h-full w-full rounded-t-[7vw]">
      <View className="p-8 flex-row items-center gap-x-10">
        <AntDesign name="left" size={30} color="gray" />
        <Text className="font-bold text-5xl">November</Text>
        <AntDesign name="right" size={30} color="gray" />
      </View>

      <View className="flex-row w-full px-7">
        {daysOfWeek.map((day) => (
          <View key={day} className="w-[14.28%] items-center justify-center">
            <Text className="font-semibold">{day}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap w-full px-7 mt-2">
        {calendarSlots.map((day, index) => (
          <View
            key={index}
            className="w-[14.28%] items-center justify-center p-1"
          >
            <View className="w-12 h-12 items-center justify-center bg-gray-200 rounded-full">
              {day && <Text>{day}</Text>}
            </View>
          </View>
        ))}
      </View>

      <View className="w-full px-9 mt-6">
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
