import { Text, View } from "react-native";
import { Link } from "expo-router";
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
    return null
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontFamily: "Nunito_700Bold", fontSize: 24 }}>
        calendar
      </Text>
      <Link
        href="/new_entry"
        style={{
          fontFamily: "Nunito_400Regular",
          fontSize: 16,
          marginTop: 10,
          color: "blue",
        }}
      >
        click to add mood
      </Link>
    </View>
  );
}
