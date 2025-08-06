import { View, Image } from "react-native";
import Calendar from "@/app/Calendar";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  return (
    <LinearGradient
      colors={[global.cutie.gradientStart, global.cutie.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className="flex-1 items-center">
        <Image
          source={require("../assets/images/tangie.png")}
          className="w-40 translate-y-5 h-40 z-40 mt-10"
          resizeMode="contain"
        />
        <Calendar />
      </View>
    </LinearGradient>
  );
}
