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
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";

type Message = {
  sender: "user" | "bot";
  content: string;
};

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      content: "Tell me what’s on your mind.\nI’ll do my best to help 💬",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false); // 👈 added loading state
  const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;

  const sendMessage = async () => {
    if (!input.trim() || !GEMINI_API_KEY) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true); // 👈 Start typing

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }],
          }),
        },
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
    } finally {
      setIsTyping(false); // 👈 Done typing
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
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-between">
          {/* Header */}
          <View className="flex-row justify-center items-baseline bg-white gap-x-28">
            <Text className="text-4xl font-nunito-bold pl-7">cutieChat</Text>
            <Image
              source={require("@/assets/images/tangie.png")}
              style={{ width: 128, height: 128 }}
              className="translate-y-12 z-40"
              resizeMode="contain"
            />
          </View>

          {/* Messages */}
          <ScrollView
            className="px-5"
            contentContainerStyle={{
              paddingBottom: 140,
              paddingTop: 20,
              flexGrow: 1,
              justifyContent: messages.length === 0 ? "center" : "flex-start",
              alignItems: "center",
            }}
          >
            {messages.map((msg, i) => (
              <View
                key={i}
                className={`my-2 flex w-full ${
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

            {/* Typing bubble */}
            {isTyping && (
              <View className="w-full items-start">
                <Text className="text-xs text-black mb-1 ml-2">cutieBot</Text>
                <View className="bg-white px-4 py-3 rounded-3xl rounded-bl-sm shadow-md max-w-[75%]">
                  <Text className="text-base text-black italic">typing...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View className="items-center justify rounded-t-xl">
            <View className="flex-row items-center bg-white px-6 pb-2 rounded-full shadow-md w-11/12 my-4">
              <TextInput
                placeholder="type here..."
                placeholderTextColor="gray"
                value={input}
                onChangeText={setInput}
                className="flex-1 text-base h-12"
              />
              <TouchableOpacity onPress={sendMessage}>
                <Ionicons
                  className="mt-2"
                  name="send"
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
