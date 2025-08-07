import { View, Text, Pressable } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function CustomNavbar() {
  return (
    <View className="flex-row items-center justify-between bg-white px-6 py-3 border-t border-black absolute bottom-0 left-0 right-0 pb-10">
      <Pressable
        className="flex items-center translate-x-8"
        onPress={() => router.push("/")}
      >
        <FontAwesome5
          name="calendar-check"
          size={40}
          color={global.cutie.orange}
        />
        <Text className="text-xs text-black">calendar</Text>
      </Pressable>

      <Pressable
        className="flex items-center -translate-y-10 bg-white rounded-full"
        onPress={() =>
          router.push({
            pathname: "/JournalPage",
            params: { date: "2025-08-06" },
          })
        }
        onLongPress={() =>
          router.push({
            pathname: "/EntryViewPage",
            params: { date: "2025-08-06" },
          })
        }
        delayLongPress={400} // optional: shorten the hold time
      >
        <AntDesign name="pluscircle" size={70} color={global.cutie.orange} />
      </Pressable>

      <Pressable
        className="flex items-center -translate-x-8"
        onPress={() => router.push("/ChatBot")}
      >
        <Ionicons name="chatbubbles" size={45} color={global.cutie.orange} />
        <Text className="text-xs text-black">chat</Text>
      </Pressable>
    </View>
  );
}
