import { useState } from "react";
import { Sparkles, PenTool, Share2, Heart, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassPanel from "./GlassPanel";
import OptionButton from "./OptionButton";
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
                    <span className="gradient-text">अल्फाज़</span> <span className="text-4xl">✨</span>
                </h1>
                <p className="text-zinc-400 text-lg">Create soul-touching poetry powered by Artificial Intelligence.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <GlassPanel className="p-8 w-full lg:w-1/2">
                    <div className="space-y-6">
                        {Object.entries(options).map(([key, values]) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider mb-2">
                                    {key}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {values.map((val) => (
                                        <OptionButton
                                            key={val}
                                            active={formData[key] === val}
                                            onClick={() => setFormData({ ...formData, [key]: val })}
                                        >
                                            {val}
                                        </OptionButton>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <GlowButton loading={loading} onClick={generate}>
                            {loading ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <Sparkles className="animate-spin" /> Generating Magic...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 justify-center">
                                    <PenTool className="w-5 h-5" /> Generate Shayari
                                </span>
                            )}
                        </GlowButton>
                    </div>
                </GlassPanel>

                {/* Output Display Panel */}
                <GlassPanel className="w-full lg:w-1/2 p-8 min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>

                    {shayari ? (
                        <ShayariCard
                            shayari={shayari}
                            onCopy={copyToClipboard}
                            onLike={likeShayari}
                            onShare={shareShayari}
                            isLiked={isLiked}
                        />
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
                </GlassPanel>
            </div>
        </div>
    );
}
