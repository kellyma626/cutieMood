import { useCallback, useState } from "react";
import { View, Image, Text, Modal, Pressable } from "react-native";
import Calendar from "@/app/Calendar";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase.js";

type MoodType =
  | "super awesome"
  | "pretty good"
  | "okay"
  | "pretty bad"
  | "really terrible";

const BAD_MOODS: MoodType[] = ["pretty bad", "really terrible"];
const MODAL_SHOWN_KEY = "supportModalLastShownDate";

const ymd = (d: Date) => {
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
};

export default function Index() {
  const [supportOpen, setSupportOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const checkThreeDayStreak = async () => {
        try {
          // Toggle to true while testing to show the modal every time
          const FORCE_TEST = __DEV__ && false;

          // Local midnight for today
          const d0 = new Date();
          d0.setHours(0, 0, 0, 0);
          const d1 = new Date(d0);
          d1.setDate(d0.getDate() - 1);
          const d2 = new Date(d0);
          d2.setDate(d0.getDate() - 2);

          const dates = [ymd(d2), ymd(d1), ymd(d0)];

          // Only once per calendar day (unless FORCE_TEST)
          if (!FORCE_TEST) {
            const lastShown = await AsyncStorage.getItem(MODAL_SHOWN_KEY);
            if (lastShown === dates[2]) return;
          }

          // Query exactly those three dates
          const { data } = await supabase
            .from("mood_entries")
            .select("date,mood")
            .in("date", dates)
            .throwOnError();

          if (cancelled) return;

          // Any bad entry marks the day as bad
          const badByDay = new Map<string, boolean>(
            dates.map((d) => [d, false]),
          );
          for (const row of data ?? []) {
            const mood = row.mood as MoodType | undefined;
            if (mood && BAD_MOODS.includes(mood)) {
              badByDay.set(row.date as string, true);
            }
          }

          const threeBad = dates.every((d) => badByDay.get(d) === true);

          if (!cancelled && threeBad) {
            setSupportOpen(true);
            if (!FORCE_TEST) {
              await AsyncStorage.setItem(MODAL_SHOWN_KEY, dates[2]);
            }
          }
        } catch (e) {
          const err = e instanceof Error ? e : new Error(String(e));
          console.error("Streak check exception:", err.message, err.stack);
        }
      };

      checkThreeDayStreak();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  return (
    <LinearGradient
      colors={[global.cutie.gradientStart, global.cutie.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className="flex-1 items-center">
        <Image
          source={require("@/assets/images/tangie.png")}
          className="w-40 translate-y-5 h-40 z-40 mt-10"
          resizeMode="contain"
        />
        <Calendar />
      </View>

      {/* Support modal */}
      <Modal
        visible={supportOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSupportOpen(false)}
      >
        <View className="flex-1 items-center justify-center">
          <Pressable
            onPress={() => setSupportOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <View className="bg-white w-[88%] rounded-3xl p-6">
            <Text className="text-2xl font-nunito-bold text-gray-800 mb-2">
              Tough streak? 💛
            </Text>
            <Text className="text-gray-700 font-nunito mb-4">
              Looks like the last three days have been rough. You’re not alone.
            </Text>

            <View className="gap-y-2 mb-5">
              <Text className="text-gray-800 font-nunito">
                • This feeling is temporary.
              </Text>
              <Text className="text-gray-800 font-nunito">
                • You’ve survived 100% of your hard days.
              </Text>
              <Text className="text-gray-800 font-nunito">
                • Try five slow breaths: in 4, hold 2, out 6.
              </Text>
            </View>

            {/* Primary: talk to the chatbot */}
            <Pressable
              onPress={() => {
                setSupportOpen(false);
                router.push("/ChatBot");
              }}
              className="bg-cutie-pink py-3 rounded-2xl items-center mb-2"
              accessibilityRole="button"
              accessibilityLabel="Chat with Tangie about what's going on"
            >
              <Text className="text-white font-nunito-bold">
                Chat with Tangie
              </Text>
              <Text className="text-white/80 font-nunito text-xs mt-0.5">
                I’ll listen and help you work through it
              </Text>
            </Pressable>

            {/* Secondary: dismiss */}
            <Pressable
              onPress={() => setSupportOpen(false)}
              className="bg-cutie-green py-3 rounded-2xl items-center"
              accessibilityRole="button"
              accessibilityLabel="I'm okay for now"
            >
              <Text className="font-nunito-bold text-white">
                I’m okay for now
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
