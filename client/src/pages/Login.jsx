import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Login3D from "../components/Login3D";

export default function Login() {
    const [useOtp, setUseOtp] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:5011/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:5011/api/auth/login-otp-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send OTP");
            }

            navigate("/verify-otp", { state: { email: formData.email, isSignup: false } });
        } catch (err) {
            setError(err.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            {/* 3D Background */}
            <Login3D />

            <div className="absolute inset-0 bg-black/40 z-0" /> {/* Overlay for readability */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 glass-panel p-8 rounded-2xl w-full max-w-md border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
                        <span className="gradient-text">Welcome Back</span>
                    </h2>
                    <p className="text-zinc-400 text-sm">Login to continue your poetic journey</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-sm text-center backdrop-blur-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={useOtp ? handleOtpRequest : handlePasswordLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Enter your email"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-600 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 focus:bg-white/10 outline-none transition-all duration-300"
                            onChange={handleChange}
                        />
                    </div>

                    {!useOtp && (
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Enter your password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-600 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 focus:bg-white/10 outline-none transition-all duration-300"
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "Processing..." : (useOtp ? "Get Login OTP" : "Login")}
                    </motion.button>
                </form>

                <div className="mt-6 flex flex-col items-center space-y-4">
                    <button
                        onClick={() => setUseOtp(!useOtp)}
                        className="text-sm text-zinc-400 hover:text-yellow-400 transition-colors"
                    >
                        {useOtp ? "Login with Password instead" : "Login via OTP instead"}
                    </button>

                    <div className="w-full h-px bg-white/10" />

                    <p className="text-zinc-500 text-sm">
                        New here?{" "}
                        <Link to="/signup" className="text-yellow-500 hover:text-yellow-400 font-medium ml-1 hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
