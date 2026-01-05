import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
        <div className="min-h-screen flex items-center justify-center bg-black/90 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-2xl w-full max-w-md border border-white/10 bg-white/5"
            >
                <h2 className="text-3xl font-bold mb-6 text-center gradient-text">Create Account</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-300 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full bg-black/40 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                            onChange={handleChange}
                        />
                    </div>
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Sending OTP..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-zinc-500 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-yellow-500 hover:text-yellow-400">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
