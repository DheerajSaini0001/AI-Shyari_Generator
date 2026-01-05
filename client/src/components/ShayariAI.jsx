import { useState } from "react";
import { Sparkles, PenTool, Share2, Heart, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShayariAI() {
    const [formData, setFormData] = useState({
        mood: "Happy",
        purpose: "Motivation",
        personality: "Bold",
        depth: "Medium",
    });

    const [shayari, setShayari] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const options = {
        mood: ["Happy", "Sad", "Motivated", "Broken", "Romantic", "Angry"],
        purpose: ["Love", "Motivation", "Life", "Hustle", "Friendship", "Success"],
        personality: ["Calm", "Bold", "Emotional", "Poetic", "Witty"],
        depth: ["Light", "Medium", "Deep", "Philosophical"],
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generate = async () => {
        setLoading(true);
        setShayari("");
        setIsLiked(false);
        setError("");

        try {
            // Assuming server runs on 5011, configuring fetch base for dev
            const response = await fetch("http://localhost:5011/api/shayari/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate Shayari");
            }

            setShayari(data.shayari);
        } catch (err) {
            console.error(err);
            setError("Failed to generate Shayari. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (shayari) {
            navigator.clipboard.writeText(shayari);
            // Optional: Show toast
        }
    };

    const shareShayari = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AI Generated Shayari',
                    text: shayari,
                    url: window.location.href, // Or your app's deployed URL
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback for browsers not supporting Web Share API
            // Could open a modal or specific links here if needed
            alert("Web Share API not supported on this browser. Copied to clipboard instead!");
            copyToClipboard();
        }
    };

    const [isLiked, setIsLiked] = useState(false);

    const likeShayari = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to save favorites!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5011/api/shayari/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ shayari })
            });

            if (response.ok) {
                setIsLiked(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold mb-2 tracking-tight">
                    <span className="gradient-text">AI Shayari Generator</span> <span className="text-4xl">✨</span>
                </h1>
                <p className="text-zinc-400 text-lg">Create soul-touching poetry powered by Artificial Intelligence.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Input Control Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-8 rounded-2xl w-full lg:w-1/2"
                >
                    <div className="space-y-6">
                        {Object.entries(options).map(([key, values]) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider mb-2">
                                    {key}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {values.map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setFormData({ ...formData, [key]: val })}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform border ${formData[key] === val
                                                ? "bg-yellow-500 text-black border-yellow-500 scale-105 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                                                : "bg-zinc-900/50 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800"
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={generate}
                        disabled={loading}
                        className="mt-8 w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Sparkles className="animate-spin" /> Generating Magic...
                            </>
                        ) : (
                            <>
                                <PenTool className="w-5 h-5" /> Generate Shayari
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Output Display Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-1/2"
                >
                    <div className="glass-panel p-8 rounded-2xl min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>

                        {shayari ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <div className="mb-6 opacity-80">
                                    <span className="text-6xl text-yellow-500/20 font-serif">"</span>
                                </div>
                                <p className="text-2xl md:text-3xl font-medium leading-relaxed text-yellow-100 whitespace-pre-line font-serif">
                                    {shayari}
                                </p>
                                <div className="mt-6 opacity-80">
                                    <span className="text-6xl text-yellow-500/20 font-serif">"</span>
                                </div>

                                <div className="mt-8 flex justify-center gap-4">
                                    <button onClick={copyToClipboard} className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 hover:text-yellow-400 transition-colors" title="Copy">
                                        <Copy className="w-5 h-5" />
                                    </button>
                                    <button onClick={likeShayari} className={`p-3 rounded-full transition-colors ${isLiked ? "bg-red-500/20 text-red-500" : "bg-zinc-800 hover:bg-zinc-700 hover:text-red-400"}`} title="Like">
                                        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                                    </button>
                                    <button onClick={shareShayari} className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 hover:text-blue-400 transition-colors" title="Share via...">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center text-zinc-500">
                                {error ? (
                                    <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-900/50">
                                        {error}
                                    </div>
                                ) : (
                                    <>
                                        <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p className="text-lg">Select your vibe and hit generate.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
