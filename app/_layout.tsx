import "../global.css";
import { Stack } from "expo-router";
import { View } from "react-native";
import CustomNavbar from "./Navbar";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <View className="flex flex-1">
      <Stack screenOptions={{ headerShown: false }} />
      <CustomNavbar />
    </View>
  );
}
