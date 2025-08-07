import "dotenv/config";

export default {
  expo: {
    name: "cutieMood",
    slug: "cutieMood",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    icon: "./assets/images/icon.png",
    scheme: "cutiemood",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#FFE1E0",
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "./node_modules/@expo-google-fonts/nunito/Nunito_400Regular.ttf",
            "./node_modules/@expo-google-fonts/nunito/Nunito_500Medium.ttf",
            "./node_modules/@expo-google-fonts/nunito/Nunito_700Bold.ttf",
          ],
        },
      ],
      [
        "expo-asset",
        {
          assets: ["./assets/images/tangie.png"],
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "MISSING_KEY",
    },
  },
};
