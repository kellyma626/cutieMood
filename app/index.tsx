import { Text, View } from "react-native";
import { Link } from "expo-router";
import { Image } from 'expo-image';

import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";

export default function Index() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl" style={{ fontFamily: "Nunito_700Bold" }}>
        calendar
      </Text>
      <Link
        href="/new_entry"
        className="text-base mt-2 text-blue-500"
        style={{ fontFamily: "Nunito_400Regular" }}
      >
        click to add mood
      </Link>
    </View>
  );
}
