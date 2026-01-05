import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
        <div className="min-h-screen flex items-center justify-center bg-black/90 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-2xl w-full max-w-md border border-white/10 bg-white/5"
            >
                <h2 className="text-3xl font-bold mb-6 text-center gradient-text">Welcome Back</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-300 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={useOtp ? handleOtpRequest : handlePasswordLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full bg-black/40 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                            onChange={handleChange}
                        />
                    </div>

                    {!useOtp && (
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full bg-black/40 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Processing..." : (useOtp ? "Get Login OTP" : "Login")}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setUseOtp(!useOtp)}
                        className="text-sm text-zinc-400 hover:text-white underline"
                    >
                        {useOtp ? "Login with Password" : "Login via OTP"}
                    </button>
                </div>

                <p className="mt-6 text-center text-zinc-500 text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-yellow-500 hover:text-yellow-400">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
