
import { useState } from "react";
import { PenTool, Send } from "lucide-react";
import GlassPanel from "../components/GlassPanel";
import GlowButton from "../components/GlowButton";
import { motion } from "framer-motion";

export default function Compose() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(""); // success or error message

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setStatus("");

        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:5011/api/community/compose", {
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
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
                    Compose <span className="gradient-text">Shayari</span>
                </h1>
                <p className="text-zinc-400">Share your own words with the world.</p>
            </div>

            <GlassPanel className="p-8">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider mb-2">
                        Your Masterpiece
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Dil ki baat, lafzon ke saath..."
                        className="w-full h-48 bg-black/40 border border-zinc-700 rounded-xl p-4 text-yellow-100 font-serif text-xl focus:border-yellow-500 focus:outline-none transition-colors resize-none leading-relaxed"
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
