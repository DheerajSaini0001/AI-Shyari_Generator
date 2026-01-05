
import { useState, useEffect } from "react";
import { Copy, Heart, BookOpen, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchLikes();
    }, []);

    const fetchLikes = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5011/api/shayari/liked", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Sort by newest first
                setLikes(data.reverse());
            }
        } catch (error) {
            console.error("Error fetching likes:", error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const deleteLike = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:5011/api/shayari/like/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setLikes(likes.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error("Error deleting like:", error);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-amber-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                    <span className="text-4xl font-bold text-black">{user?.name?.charAt(0) || "U"}</span>
                </div>
                <h1 className="text-4xl font-extrabold mb-2 text-white/90 tracking-tight">
                    {user?.name || "Your Profile"}
                </h1>
                <p className="text-zinc-400">Your personal collection of gems</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">{likes.length}</div>
                    <div className="text-xs uppercase tracking-wider text-zinc-500">Liked Shayaris</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-1">Coming Soon</div>
                    <div className="text-xs uppercase tracking-wider text-zinc-500">Shared Gems</div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white/80">
                <Heart className="w-6 h-6 text-red-500 fill-current" />
                Liked Collection
            </h2>

            {loading ? (
                <div className="text-center py-20 text-zinc-500">Loading your collection...</div>
            ) : likes.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-2xl border border-white/5 border-dashed">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                    <p className="text-zinc-400">No liked shayaris yet.</p>
                    <p className="text-sm text-zinc-600 mt-2">Go generate some magic and save your favorites!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {likes.map((item, index) => (
                        <motion.div
                            key={item._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={() => copyToClipboard(item.text)}
                                    className="p-2 bg-black/50 rounded-full hover:bg-yellow-500 hover:text-black transition-colors"
                                    title="Copy"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deleteLike(item._id)}
                                    className="p-2 bg-black/50 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                    title="Remove from favorites"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-lg text-yellow-100/90 leading-relaxed font-serif whitespace-pre-line mb-4">
                                {item.text}
                            </p>

                            <div className="text-xs text-zinc-600 flex justify-between items-center mt-4 border-t border-white/5 pt-4">
                                <span>{new Date(item.likedAt).toLocaleDateString()}</span>
                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
