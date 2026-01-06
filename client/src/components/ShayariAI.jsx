import { useState } from "react";
import { Sparkles, PenTool } from "lucide-react";
import GlassPanel from "./GlassPanel";
import GlowButton from "./GlowButton";
import ShayariCard from "./ShayariCard";

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
                "http://localhost:5011/api/shayari/generate",
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

        await fetch("http://localhost:5011/api/shayari/like", {
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
        <>
            {/* HERO */}
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                    <span className="gradient-text">अल्फ़ाज़</span>
                </h1>
                <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
                    Craft soulful poetry through the harmony of emotions and artificial intelligence
                </p>
            </div>

            {/* MAIN GRID */}
            <div className="grid lg:grid-cols-2 gap-10">
                {/* CONTROLS */}
                <GlassPanel className="p-8">
                    {Object.entries(options).map(([key, values]) => (
                        <div key={key} className="mb-8 text-left">
                            <p className="text-xs uppercase tracking-wider text-zinc-400 mb-4">
                                {key}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {values.map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setFormData({ ...formData, [key]: v })}
                                        className={`px-4 py-2 rounded-full border text-sm transition-all ${formData[key] === v
                                                ? "bg-yellow-500 text-black border-yellow-400 neon-glow"
                                                : "bg-zinc-900/60 text-zinc-400 border-zinc-700 hover:border-zinc-500"
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
                <GlassPanel className="p-8 min-h-[380px] flex items-center justify-center relative">
                    {shayari ? (
                        <ShayariCard
                            shayari={shayari}
                            onCopy={copyToClipboard}
                            onLike={likeShayari}
                            onShare={shareShayari}
                            isLiked={isLiked}
                        />
                    ) : (
                        <div className="text-zinc-500 text-center">
                            {error ? (
                                <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-900/40">
                                    {error}
                                </div>
                            ) : (
                                <>
                                    <Sparkles
                                        className="mx-auto mb-5 opacity-30"
                                        size={52}
                                    />
                                    <p className="text-sm">
                                        Select your mood and depth<br />
                                        then let the magic unfold
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </GlassPanel>
            </div>
        </>
    );
}
