import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isSignup = location.state?.isSignup || false;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const endpoint = isSignup
            ? `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`
            : `${import.meta.env.VITE_API_URL}/api/auth/login-otp-verify`;

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Verification failed");
            }

            setSuccess("Verified successfully!");

            // Save token and login user
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err) {
            setError(err.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen mx-2 flex items-center justify-center bg-black text-white">
                <p>No email provided. <Link to="/login" className="text-yellow-500">Go to Login</Link></p>
            </div>
        );
    }

    return (
        <div className="min-h-screen mx-2 flex items-center justify-center bg-black/90 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-2xl w-full max-w-sm border border-white/10 bg-white/5 text-center"
            >
                <h2 className="text-2xl font-bold mb-2">Enter OTP</h2>
                <p className="text-zinc-400 mb-6 text-sm">We sent a 6-digit code to <span className="text-white font-medium">{email}</span></p>

                {error && <div className="mb-4 text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>}
                {success && <div className="mb-4 text-green-400 text-sm bg-green-900/20 p-2 rounded">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={otp}
                        maxLength="6"
                        placeholder="000000"
                        className="w-full bg-black/40 border border-zinc-700 rounded-lg p-3 text-center text-2xl tracking-[0.5em] text-white focus:border-yellow-500 focus:outline-none transition-colors"
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />

                    <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify & Login"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
