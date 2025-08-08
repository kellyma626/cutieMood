# cutieMood ❤︎₊ ⊹

_by Kelly Ma and Simon Cun_

> a cute, colorful mental health app that helps you track your moods, write little reflections, and talk to a chatbot friend, all with the help of cuties 🍊✨

---

## 🍊💖 Project Overview

cutieMood is a cheerful mobile app designed to help users check in with their feelings in a playful, supportive way. With mood tracking, journaling, and an AI chatbot, it’s made for people who want a fun, unserious space to reflect, especially during tough moments or daily ups and downs.

---

## ✨ Key Features

- 🍊 **Mood check-ins**: pick a cute mood + write a quick journal entry
- 📅 **Mood calendar**: visualize your mood history with color-coded days
- 🤖 **Chatbot (cutieBot)**: powered by Gemini, it replies with empathy and care
- 📱 **Adorable UI**: filled with derpy oranges, pastel gradients, and rounded cozy buttons

---

## 🧡 Demo Video

🛠️🍊 TODO: add demo video 

---

## 🌸 Visual Design

cutieMood’s UI is inspired by kawaii aesthetics, mobile journaling, and pastel palettes.

<img width="1393" height="602" alt="Screenshot 2025-08-06 at 5 29 46 PM" src="https://github.com/user-attachments/assets/80ccb7bf-f928-4a33-adf4-007e3291657b" />

---

## 💻 Tech Stack

| Area           | Tools Used                       |
| -------------- | -------------------------------- |
| Frontend       | React Native + Expo              |
| Styling        | NativeWind (Tailwind CSS for RN) |
| AI Integration | Gemini API                       |
| Backend & Auth | Supabase                         |
| Design         | Figma                            |
| Language       | TypeScript                       |

---

## 💾 Installation & Usage

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Run it locally

```bash
git clone https://github.com/kellyma626/cutieMood.git
cd cutieMood
npm install
npx expo start
```

### Environment Variables

Create a `.env` file and add:

```
GEMINI_API_KEY = your_key_here
```

Create a `lib` folder with a `supabase.js` file and add:

```
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = your_url_here
const supabaseAnonKey = your_key_here

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 👩🏻‍💻👨🏻‍💻 Team Members

| Name      | GitHub                                       | Contributions                                                                    |
| --------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| Kelly Ma  | [@kellyma626](https://github.com/kellyma626) | Mood entry UI + logic, Supabase backend integration, project design and planning |
| Simon Cun | [@Simon-Cun](https://github.com/Simon-Cun)   | Calendar UI + logic, chatbot UI + Gemini AI integration, framework configuration |

---

## 🌱 Next Steps

- Add user authentication
- Add image property to journal entry

---

## 📁 Folder Structure (simplified)

```
cutieMood/
├── assets/
├── lib/
│   └── supabase.js
├── app/
│   └── _layout.tsx
│   └── index.tsx
│   └── Calendar.tsx
│   └── JournalPage.tsx
│   └── EntryViewPage.tsx
│   └── ChatBot.tsx
│   └── Navbar.tsx
└── .env
```

---

## 💌 Notes

cutieMood isn’t meant to replace therapy or be deeply scientific. It’s meant to be a cute way for checking in with your feelings.
We made it because mental health tools can (and should!) feel fun, silly, and spark joy ♡

---
