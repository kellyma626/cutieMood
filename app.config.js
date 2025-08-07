import "dotenv/config";

export default {
  expo: {
    name: "cutieMood",
    slug: "cutieMood",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "MISSING_KEY",
    },
  },
};
