import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";

export default function ChatBot() {
  return (
    <LinearGradient
      colors={[global.cutie.gradientStart, global.cutie.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Outer container to vertically separate header and input */}
      <View className="flex-1 justify-between">
        {/* Header */}
        <View className="flex-row justify-center items-baseline bg-white pt-10">
          <Text className="text-5xl font-bold pl-7">cutieChat</Text>
          <Image
            source={require("../assets/images/tangie.png")}
            className="w-52 translate-y-12 h-52 z-40"
            resizeMode="contain"
          />
        </View>

        <View className="items-center -translate-y-52">
          <View className="flex-row items-center bg-white px-4 py-3 rounded-full shadow-md w-11/12">
            <TextInput
              placeholder="type here..."
              placeholderTextColor="gray"
              className="flex-1 text-base"
            />
            <TouchableOpacity>
              <Entypo
                name="paper-plane"
                size={24}
                color={global.cutie.orange}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
