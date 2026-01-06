import { useState } from "react";
import { Sparkles, PenTool } from "lucide-react";
import GlassPanel from "./GlassPanel";
import GlowButton from "./GlowButton";
import ShayariCard from "./ShayariCard";
import { useTheme } from "../context/ThemeContext";

export default function ShayariAI() {
    const { theme } = useTheme();
    const darkMode = theme === "dark";

    const [formData, setFormData] = useState({
        mood: "Happy",
        purpose: "Motivation",
        personality: "Bold",
        depth: "Medium",
    });

    const [shayari, setShayari] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isLiked, setIsLiked] = useState(false);

    const options = {
        mood: ["Happy", "Sad", "Motivated", "Broken", "Romantic", "Angry"],
        purpose: ["Love", "Motivation", "Life", "Hustle", "Friendship", "Success"],
        personality: ["Calm", "Bold", "Emotional", "Poetic", "Witty"],
        depth: ["Light", "Medium", "Deep", "Philosophical"],
    };

    const generate = async () => {
        setLoading(true);
        setShayari("");
        setError("");
        setIsLiked(false);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/shayari/generate`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate shayari");
            }

            setShayari(data.shayari);
        } catch (err) {
            setError("Failed to generate Shayari. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (shayari) navigator.clipboard.writeText(shayari);
    };

    const shareShayari = async () => {
        if (navigator.share) {
            await navigator.share({
                title: "AI Generated Shayari",
                text: shayari,
                url: window.location.href,
            });
        } else {
            copyToClipboard();
            alert("Copied to clipboard (Share not supported)");
        }
    };

    const likeShayari = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Please login first");

        await fetch(`${import.meta.env.VITE_API_URL}/api/shayari/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ shayari }),
        });

        setIsLiked(true);
    };

    return (
        <div
            className={`transition-colors duration-300 min-h-screen ${darkMode ? "bg-black text-gray-100" : "bg-gray-50 text-gray-900"
                }`}
        >
            {/* HERO */}
            <div className="text-center mb-16 pt-12">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                    <span className="gradient-text">अल्फ़ाज़</span>
                </h1>

                <p
                    className={`mt-4 max-w-xl mx-auto ${darkMode ? "text-zinc-400" : "text-gray-600"
                        }`}
                >
                    Craft soulful poetry through the harmony of emotions and artificial intelligence
                </p>
            </div>

            {/* MAIN GRID */}
            <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto px-6 pb-4">
                {/* CONTROLS */}
                <GlassPanel
                    className={`p-8 ${darkMode
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-gray-200"
                        }`}
                >
                    {Object.entries(options).map(([key, values]) => (
                        <div key={key} className="mb-8 text-left">
                            <p
                                className={`text-xs uppercase tracking-wider mb-4 ${darkMode ? "text-zinc-400" : "text-gray-500"
                                    }`}
                            >
                                {key}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {values.map((v) => (
                                    <button
                                        key={v}
                                        onClick={() =>
                                            setFormData({ ...formData, [key]: v })
                                        }
                                        className={`px-4 py-2 rounded-full border text-sm transition-all
                                            ${formData[key] === v
                                                ? "bg-yellow-500 text-black border-yellow-400 neon-glow"
                                                : darkMode
                                                    ? "bg-zinc-900/60 text-zinc-400 border-zinc-700 hover:border-zinc-500"
                                                    : "bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-500"
                                            }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <GlowButton loading={loading} onClick={generate}>
                        {loading ? (
                            <span className="flex items-center gap-2 justify-center">
                                <Sparkles className="animate-spin" />
                                Creating poetry…
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 justify-center">
                                <PenTool className="w-4 h-4" />
                                Generate Shayari
                            </span>
                        )}
                    </GlowButton>
                </GlassPanel>

                {/* OUTPUT */}
                <GlassPanel
                    className={`p-8 min-h-[380px] flex items-center justify-center ${darkMode
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-gray-200"
                        }`}
                >
                    {shayari ? (
                        <ShayariCard
                            shayari={shayari}
                            onCopy={copyToClipboard}
                            onLike={likeShayari}
                            onShare={shareShayari}
                            isLiked={isLiked}
                        />
                    ) : (
                        <div
                            className={`text-center ${darkMode ? "text-zinc-500" : "text-gray-500"
                                }`}
                        >
                            {error ? (
                                <div
                                    className={`p-4 rounded-lg border ${darkMode
                                            ? "text-red-400 bg-red-900/20 border-red-900/40"
                                            : "text-red-600 bg-red-100 border-red-300"
                                        }`}
                                >
                                    {error}
                                </div>
                            ) : (
                                <>
                                    <Sparkles
                                        className="mx-auto mb-5 opacity-30"
                                        size={52}
                                    />
                                    <p className="text-sm">
                                        Select your mood and depth
                                        <br />
                                        then let the magic unfold
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </GlassPanel>
            </div>
        </div>
    );
}
