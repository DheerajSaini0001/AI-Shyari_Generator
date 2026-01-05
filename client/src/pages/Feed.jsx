
import { useState, useEffect } from "react";
import { Copy, Heart, Clock, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import GlassPanel from "../components/GlassPanel";

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeed();
    }, []);

    const fetchFeed = async () => {
        try {
            const response = await fetch("http://localhost:5011/api/community/feed");
            if (response.ok) {
                const data = await response.json();
                setFeed(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to like posts!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5011/api/community/like/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedLikes = await response.json();
                setFeed(feed.map(item =>
                    item._id === id ? { ...item, likes: updatedLikes } : item
                ));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?.id;

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
                    Community <span className="gradient-text">Feed</span>
                </h1>
                <p className="text-zinc-400">Discover gems from other poets.</p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-zinc-500">Loading feed...</div>
            ) : feed.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">No shayaris yet. Be the first to compose one!</div>
            ) : (
                <div className="space-y-8">
                    {feed.map((item, index) => {
                        const isLiked = item.likes.includes(currentUserId);
                        return (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassPanel className="p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-30"></div>

                                    {/* Author Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                                            <span className="font-bold text-zinc-400">{item.authorName?.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-200">{item.authorName}</h3>
                                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="pl-4 border-l-2 border-yellow-500/20 mb-6">
                                        <p className="text-xl md:text-2xl text-yellow-100/90 font-serif whitespace-pre-line leading-relaxed">
                                            {item.text}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleLike(item._id)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${isLiked ? "text-red-500 bg-red-500/10" : "text-zinc-400 hover:text-red-400 hover:bg-zinc-800"}`}
                                            >
                                                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                                <span className="text-sm font-medium">{item.likes.length}</span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => copyToClipboard(item.text)}
                                            className="text-zinc-500 hover:text-yellow-500 transition-colors"
                                            title="Copy"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </GlassPanel>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
