
import { useState } from "react";
import { PenTool, Send } from "lucide-react";
import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function Compose() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const { theme } = useTheme();
    const darkMode = theme === "dark";

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setStatus("");

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/community/compose`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                setStatus("Sent for approval! An admin will review your masterpiece soon.");
                setText("");
            } else {
                setStatus("Failed to submit. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setStatus("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto pt-20 mb-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
                    Compose <span className="gradient-text">Shayari</span>
                </h1>
                <p className={`${darkMode ? "text-zinc-400" : "text-gray-600"}`}>Share your own words with the world.</p>
            </div>

            <GlassPanel className={`p-8 ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
                <div className="mb-6">
                    <label className={`block text-sm font-medium uppercase tracking-wider mb-2 ${darkMode ? "text-zinc-300" : "text-gray-600"}`}>
                        Your Masterpiece
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Dil ki baat, lafzon ke saath..."
                        className={`w-full h-48 border rounded-xl p-4 font-serif text-xl focus:outline-none transition-colors resize-none leading-relaxed
                            ${darkMode
                                ? "bg-black/40 border-zinc-700 text-yellow-100 focus:border-yellow-500 placeholder:text-zinc-600"
                                : "bg-gray-50 border-gray-300 text-gray-800 focus:bg-white focus:border-yellow-600 placeholder:text-gray-400"
                            }`}
                    />
                </div>

                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-lg text-center ${status.includes("Sent") ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                    >
                        {status}
                    </motion.div>
                )}

                <GlowButton loading={loading} onClick={handleSubmit}>
                    {loading ? (
                        "Submitting..."
                    ) : (
                        <span className="flex items-center gap-2 justify-center">
                            <Send className="w-5 h-5" /> Submit for Approval
                        </span>
                    )}
                </GlowButton>
            </GlassPanel>
        </div>
    );
}
