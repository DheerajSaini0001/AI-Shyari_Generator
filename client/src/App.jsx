import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import ShayariAI from "./components/ShayariAI";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyOtp from "./pages/VerifyOtp";

// Protected Route Component
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
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
            <Route path="/" element={
              <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                <div className="relative z-10 w-full max-w-4xl px-4 py-8">
                  <nav className="absolute top-4 right-4 z-20">
                    <button
                      onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                      className="text-sm bg-red-600/20 text-red-400 px-4 py-2 rounded-full border border-red-600/50 hover:bg-red-600 hover:text-white transition-all"
                    >
                      Logout
                    </button>
                  </nav>
                  <ShayariAI />
                </div>
              </div>
            } />
          </Route>

          {/* Redirect unknown to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
