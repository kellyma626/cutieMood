import { View, Image } from "react-native";
import Calendar from "@/app/Calendar";

export default function Index() {
  return (
    <View className="flex-1 items-center ">
      <Image
        source={require("../assets/images/tangie.png")}
        className="w-40 translate-y-5 h-40 z-40 mt-10"
        resizeMode="contain"
      />
      <Calendar />
    </View>
  );
}
