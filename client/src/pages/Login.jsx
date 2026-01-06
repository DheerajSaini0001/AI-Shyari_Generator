import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Login3D from "../components/Login3D";
import { useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";

const floatingWords = [
  "प्रेम",
  "हृदय",
  "भावना",
  "अनुभूति",
  "मौन",
  "शब्द",
  "कविता",
  "स्मृति",
  "आत्मा",
  "संवेदना",

  "आस",
  "विश्वास",
  "स्पर्श",
  "सौंदर्य",
  "सपना",
  "चाहत",
  "ममता",
  "आँचल",
  "धड़कन",
  "संगीत",

  "निशा",
  "प्रभात",
  "चाँद",
  "तारे",
  "आकाश",
  "रात",
  "सवेरा",
  "धूप",
  "छाया",
  "हवा",

  "पथ",
  "यात्रा",
  "क्षण",
  "लम्हा",
  "अनंत",
  "सफ़र",
  "मिलन",
  "वियोग",
  "आहट",
  "नज़दीक",

  "सुकून",
  "शांति",
  "संतुलन",
  "स्वप्न",
  "आभास",
  "स्पंदन",
  "भाव",
  "राग",
  "ताल",
  "सरोवर",

  "प्रकृति",
  "जीवन",
  "रचना",
  "कल्पना",
  "सृजन",
  "अस्तित्व",
  "नवीन",
  "अनुराग",
  "संयोग",
  "अनुरणन"
];




export default function Login() {
  const visibleWords = useMemo(() => {
    return [...floatingWords]
      .sort(() => 0.5 - Math.random())
      .slice(0, 12); // 👈 show only 12 words
  }, []);

  const wordPositions = useMemo(() => {
    return visibleWords.map(() => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
    }));
  }, [visibleWords]);

  const wordMotion = useMemo(() => {
    return visibleWords.map(() => {
      const x = (Math.random() - 0.5) * 120; // horizontal drift
      const y = (Math.random() - 0.5) * 120; // vertical drift
      const duration = 12 + Math.random() * 10; // 12–22s
      const delay = Math.random() * 4;

      return { x, y, duration, delay };
    });
  }, [visibleWords]);

  const [useOtp, setUseOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login-otp-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      navigate("/verify-otp", {
        state: { email: formData.email, isSignup: false },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-2 min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-black via-[#050816] to-black text-white">

      {/* Ambient Background */}
      <Login3D />

      {/* Floating Words */}
      {visibleWords.map((word, i) => (
        <motion.span
          key={word}
          initial={{
            opacity: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0.35, 0.75, 0.35],
            x: [0, wordMotion[i].x, 0],
            y: [0, wordMotion[i].y, 0],
          }}
          transition={{
            duration: wordMotion[i].duration,
            delay: wordMotion[i].delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute text-amber-300 text-4xl md:text-5xl 
    font-serif tracking-wide select-none pointer-events-none"
          style={{
            left: wordPositions[i].left,
            top: wordPositions[i].top,
            textShadow: `
        0 0 12px rgba(255, 191, 0, 0.5),
        0 0 40px rgba(255, 191, 0, 0.3)
      `,
            zIndex: 1,
          }}
        >
          {word}
        </motion.span>
      ))}




      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 rounded-3xl 
        bg-white/5 backdrop-blur-2xl border border-white/10 
        shadow-[0_0_100px_rgba(255,200,100,0.12)]"
      >
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              अल्फ़ाज़
            </span>
          </h1>
          <p className="mt-3 text-zinc-400 text-sm italic">
            Where words fall in love
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={useOtp ? handleOtpRequest : handlePasswordLogin}
          className="space-y-6"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            onChange={handleChange}
            className="w-full rounded-xl p-3.5 bg-black/30 border border-white/10 
            placeholder-zinc-500 focus:border-amber-400 focus:ring-1 
            focus:ring-amber-400 outline-none transition"
          />

          {!useOtp && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                onChange={handleChange}
                className="w-full rounded-xl p-3.5 bg-black/30 border border-white/10 
                placeholder-zinc-500 focus:border-amber-400 focus:ring-1 
                focus:ring-amber-400 outline-none transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 
                hover:text-amber-400 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-black 
            bg-gradient-to-r from-amber-400 to-yellow-500 
            shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 
            transition disabled:opacity-50"
          >
            {loading
              ? "Preparing your space…"
              : useOtp
                ? "Send login code"
                : "Sign in"}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <button
            onClick={() => setUseOtp(!useOtp)}
            className="text-sm text-zinc-400 hover:text-amber-400 transition"
          >
            {useOtp ? "Use password instead" : "Sign in with a one-time code"}
          </button>

          <p className="text-sm text-zinc-500">
            New here?
            <Link
              to="/signup"
              className="ml-1 text-amber-400 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
