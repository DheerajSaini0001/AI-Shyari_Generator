# Alfaaz - AI Shayari Generator :sparkles: :writing_hand:

**Alfaaz** ("Words") is a premium AI-powered platform for poetry and shayari enthusiasts. It blends the beauty of traditional literature with modern artificial intelligence, allowing users to generate, share, and explore soulful shayaris in a visually stunning environment. "Where words fall in love."

## :rocket: Features

- **:robot: AI-Powered Generation**:Create unique shayaris based on emotions, keywords, or themes using advanced AI.
- **:globe_with_meridians: Community Feed**: Explore a curated feed of community-submitted ("Composed") and AI-generated ("Alfaaz") shayaris.
- **:art: Premium UI/UX**: A visually immersive experience featuring glassmorphism, smooth animations (Framer Motion / Reanimated), and a rich dark-themed aesthetic.
- **:iphone: Cross-Platform**: Available as a responsive **Web App** and a native **Mobile App** (iOS & Android).
- **:bust_in_silhouette: User Accounts**: Secure login and signup implementation to manage your profile and liked posts.
- **:heart: Social Interactions**: Like, copy, and share your favorite couplets with ease.

## :hammer_and_wrench: Tech Stack

### **Client (Web)**
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS, Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks (Context API)

### **Mobile (App)**
- **Framework**: React Native (Expo SDK 50+)
- **Styling**: NativeWind v4 (Tailwind CSS for Native)
- **Animations**: React Native Reanimated
- **Gradient**: Expo Linear Gradient
- **Navigation**: React Navigation (Native Stack)

### **Server (Backend)**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (assumed)
- **AI Integration**: Google Gemini / OpenAI (depending on implementation)

---

## :open_file_folder: Project Structure

```bash
AI-Shyari_Generator/
├── client/          # React Web Application
│   ├── src/
│   │   ├── components/  # Reusable UI components (GlassPanel, etc.)
│   │   ├── pages/       # Application routes (Feed, Login, etc.)
│   │   └── ...
├── server/          # Backend API
│   ├── routes/      # API Endpoints
│   ├── models/      # Database Schemas
│   └── ...
├── mobile/          # React Native Mobile Application
│   ├── screens/     # Mobile Screens (Login, Feed, etc.)
│   └── ...
└── README.md        # Project Documentation
```

---

## :checkered_flag: Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo Go app (for mobile testing)

### 1. Setup Backend (Server)
```bash
cd server
npm install
# Create a .env file with your credentials (MONGO_URI, GEMINI_API_KEY, PORT, etc.)
npm start
```

### 2. Setup Frontend (Client)
```bash
cd client
npm install
# Create a .env file:
# VITE_API_URL=http://localhost:5000 (or your deployed backend URL)
npm run dev
```

### 3. Setup Mobile App
```bash
cd mobile
npm install
# Start the Metro bundler
npx expo start
```
- Scan the QR code with **Expo Go** (Android) or use the Camera app (iOS).
- Press `a` for Android Emulator or `i` for iOS Simulator.

---

## :iphone: Mobile Development Notes
The mobile app uses **NativeWind** for styling, which allows sharing Tailwind classes between the web and mobile codebases.
- **Routing**: `react-navigation` matches the web's `react-router-dom` flow.
- **Animations**: `framer-motion` (web) concepts are ported to `react-native-reanimated` (mobile) for consistent feel.

---

## :scroll: License
This project is open-source and available under the [MIT License](LICENSE).

---
*Developed with :heart: by Dheeraj*