import "../global.css";
import "../colors.global";
import { Stack, usePathname } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Navbar from "@/app/Navbar";
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

  const pathname = usePathname();
  const hideNavbarRoutes = ["/JournalPage"]; // add more routes here if needed

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={[global.cutie.gradientStart, global.cutie.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
      {!hideNavbarRoutes.includes(pathname) && <Navbar />}
    </LinearGradient>
  );
}
