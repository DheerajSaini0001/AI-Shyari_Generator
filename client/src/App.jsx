import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyOtp from "./pages/VerifyOtp";
import ShayariAI from "./components/ShayariAI";

import Feed from "./pages/Feed";
import Compose from "./pages/Compose";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotificationDropdown from "./components/NotificationDropdown";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { User, LogOut, Home, Users, PenBox, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

// Protected Route Component
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

const Layout = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.isAdmin === true;
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-300 ${darkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Background - Fixed */}
      {darkMode && (
        <>
          <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat -z-20"></div>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm -z-10"></div>
        </>
      )}
      {!darkMode && (
        <div className="fixed inset-0 bg-gray-50 -z-20"></div>
      )}

      {/* Content Structure */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Static Header */}
        <header className={`w-full p-4 border-b sticky top-0 z-50 backdrop-blur-md transition-colors ${darkMode ? "border-white/5 bg-black/20" : "border-gray-200 bg-white/80"}`}>
          <div className="w-full px-4 flex justify-between items-center">
            <Link to="/" className={`text-xl font-bold tracking-tight hover:text-yellow-500 transition-colors ${darkMode ? "text-white" : "text-gray-900"}`}>
              अल्फ़ाज़ ✨
            </Link>

            <nav className="flex gap-4 items-center">
              <ThemeToggle />
              <Link to="/" className={`p-2 rounded-full transition-colors ${darkMode ? "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900"}`} title="Home">
                <Home className="w-5 h-5" />
              </Link>
              <Link to="/feed" className={`p-2 rounded-full transition-colors ${darkMode ? "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900"}`} title="Community Feed">
                <Users className="w-5 h-5" />
              </Link>
              <Link to="/compose" className={`p-2 rounded-full transition-colors ${darkMode ? "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900"}`} title="Compose">
                <PenBox className="w-5 h-5" />
              </Link>

              {/* Notification Dropdown */}
              <NotificationDropdown />

              <Link to="/profile" className={`p-2 rounded-full transition-colors ${darkMode ? "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900"}`} title="Profile">
                <User className="w-5 h-5" />
              </Link>

              {/* Admin Link (Visible if Admin) */}
              {isAdmin && (
                <Link to="/admin" className="p-2 rounded-full bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors border border-yellow-500/20" title="Admin Dashboard">
                  <ShieldCheck className="w-5 h-5" />
                </Link>
              )}

              <button
                onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                className="p-2 rounded-full bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600 hover:text-white transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 w-full flex flex-col items-center">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen w-full font-sans transition-colors">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />

            {/* Private Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Main App Layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<ShayariAI />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/compose" element={<Compose />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* Redirect unknown to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
