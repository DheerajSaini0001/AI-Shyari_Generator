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

  return (
    <div className="min-h-screen w-full relative">
      {/* Background - Fixed */}
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat -z-20"></div>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm -z-10"></div>

      {/* Content Structure */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Static Header */}
        <header className="w-full p-4 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-yellow-500 transition-colors">
              अल्फ़ाज़ ✨
            </Link>

            <nav className="flex gap-4 items-center">
              <Link to="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Home">
                <Home className="w-5 h-5" />
              </Link>
              <Link to="/feed" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Community Feed">
                <Users className="w-5 h-5" />
              </Link>
              <Link to="/compose" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Compose">
                <PenBox className="w-5 h-5" />
              </Link>

              {/* Notification Dropdown */}
              <NotificationDropdown />

              <Link to="/profile" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Profile">
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
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full font-sans text-white bg-black">
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
// ...

          {/* Redirect unknown to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
