import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Login3D from "../components/Login3D";

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

export default function Signup() {
    const visibleWords = useMemo(() => {
        return [...floatingWords]
            .sort(() => 0.5 - Math.random())
            .slice(0, 12);
    }, []);

    const wordPositions = useMemo(() => {
        return visibleWords.map(() => ({
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
        }));
    }, [visibleWords]);

    const wordMotion = useMemo(() => {
        return visibleWords.map(() => {
            const x = (Math.random() - 0.5) * 120;
            const y = (Math.random() - 0.5) * 120;
            const duration = 12 + Math.random() * 10;
            const delay = Math.random() * 4;

            return { x, y, duration, delay };
        });
    }, [visibleWords]);

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5011/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            // Navigate to OTP handling page
            navigate("/verify-otp", { state: { email: formData.email, isSignup: true } });
        } catch (err) {
            console.error(err);
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-2 relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-black via-[#050816] to-black text-white">

            {/* Ambient Background */}
            <Login3D />

            {/* Floating Words */}
            {visibleWords.map((word, i) => (
                <motion.span
                    key={word}
                    initial={{ opacity: 0, x: 0, y: 0 }}
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
                    className="absolute text-amber-300 text-4xl md:text-5xl font-serif tracking-wide select-none pointer-events-none"
                    style={{
                        left: wordPositions[i].left,
                        top: wordPositions[i].top,
                        textShadow: `0 0 12px rgba(255, 191, 0, 0.5), 0 0 40px rgba(255, 191, 0, 0.3)`,
                        zIndex: 1,
                    }}
                >
                    {word}
                </motion.span>
            ))}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

            {/* Signup Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-10 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_100px_rgba(255,200,100,0.12)]"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                            Join अल्फ़ाज़
                        </span>
                    </h1>
                    <p className="mt-3 text-zinc-400 text-sm italic">
                        Start your poetic journey
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-left text-sm text-zinc-400 mb-1 pl-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Your Name"
                            className="w-full rounded-xl p-3.5 bg-black/30 border border-white/10 placeholder-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-left text-sm text-zinc-400 mb-1 pl-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email address"
                            className="w-full rounded-xl p-3.5 bg-black/30 border border-white/10 placeholder-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-left text-sm text-zinc-400 mb-1 pl-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                placeholder="Create a password"
                                className="w-full rounded-xl p-3.5 bg-black/30 border border-white/10 placeholder-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition pr-12"
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-400 transition"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl font-semibold text-black bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </motion.button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link to="/login" className="ml-1 text-amber-400 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
