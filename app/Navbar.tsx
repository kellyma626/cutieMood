import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";

export default function CustomNavbar() {
  return (
    <View className="flex-row items-center justify-between bg-white px-6 py-3 border-t border-black bottom-0">
      <TouchableOpacity className="flex items-center ml-8">
        <Image
          source={require("../assets/images/Today.png")}
          className="w-16 h-16 mb-1"
          resizeMode="contain"
        />
        <Text className="text-xs text-black">calendar</Text>
      </TouchableOpacity>
      <TouchableOpacity className="-mt-24">
        <Image
          source={require("../assets/images/Add.png")}
          className="w-28 h-28"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity className="flex items-center mr-8">
        <Image
          source={require("../assets/images/Chat.png")}
          className="w-16 h-16 mb-1"
          resizeMode="contain"
        />
        <Text className="text-xs text-black">chat</Text>
      </TouchableOpacity>
    </View>
  );
}
