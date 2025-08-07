import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import Constants from "expo-constants";

type Message = {
  sender: "user" | "bot";
  content: string;
};

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;

  const sendMessage = async () => {
    if (!input.trim() || !GEMINI_API_KEY) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", content: userMessage }]);
    setInput("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }],
          }),
        }
      );

      const data = await response.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (botReply) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", content: botReply.trim() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", content: "Hmm... no reply!" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Oops! Something broke :(" },
      ]);
    }
  };

  return (
    <LinearGradient
      colors={[global.cutie.gradientStart, global.cutie.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-between">
          {/* Header */}
          <View className="flex-row justify-center items-baseline bg-white">
            <Text className="text-5xl font-bold pl-7">cutieChat</Text>
            <Image
              source={require("../assets/images/tangie.png")}
              className="w-48 translate-y-12 h-48 z-40"
              resizeMode="contain"
            />
          </View>

          {/* Message bubbles */}
          <ScrollView
            className="px-5"
            contentContainerStyle={{
              paddingBottom: 140,
              paddingTop: 20,
            }}
          >
            {messages.map((msg, i) => (
              <View
                key={i}
                className={`my-2 flex ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <Text className="text-xs text-black mb-1 ml-2">cutieBot</Text>
                )}
                <View
                  className={`px-4 py-3 max-w-[75%] shadow-md ${
                    msg.sender === "user"
                      ? "bg-white rounded-3xl rounded-br-sm"
                      : "bg-white rounded-3xl rounded-bl-sm"
                  }`}
                >
                  <Text className="text-base text-black">{msg.content}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input */}
          <View className="items-center justify rounded-t-xl">
            <View className="flex-row items-center bg-white px-4 py-3 rounded-full shadow-md w-11/12 my-4">
              <TextInput
                placeholder="type here..."
                placeholderTextColor="gray"
                value={input}
                onChangeText={setInput}
                className="flex-1 text-base"
              />
              <TouchableOpacity onPress={sendMessage}>
                <Entypo
                  name="paper-plane"
                  size={24}
                  color={global.cutie.orange}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <View className="h-40 w-full" />
    </LinearGradient>
  );
}
