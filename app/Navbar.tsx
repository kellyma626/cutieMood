import { View, Text, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

export default function CustomNavbar() {
  return (
    <View className="flex-row items-center justify-between bg-white px-6 py-3 border-t border-black absolute bottom-0 left-0 right-0 pb-10">
      <Pressable
        className="flex items-center ml-8"
        onPress={() => router.push("/")}
      >
        <FontAwesome name="calendar" size={40} color="orange" />
        <Text className="text-xs text-black">calendar</Text>
      </Pressable>

      <Pressable
        className="flex items-center -translate-y-10 bg-white rounded-full"
        onPress={() => router.push("/new_entry")}
      >
        <AntDesign name="pluscircle" size={70} color="orange" />
      </Pressable>

      <Pressable className="flex items-center mr-8">
        <FontAwesome name="comments" size={40} color="orange" />
        <Text className="text-xs text-black">chat</Text>
      </Pressable>
    </View>
  );
}
