
import { useState, useEffect } from "react";
import { Copy, Heart, BookOpen, Trash2, PenBox } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {
    const [likes, setLikes] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("likes"); // 'likes' or 'posts'
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const { theme } = useTheme();
    const darkMode = theme === "dark";

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchLikes();
        fetchMyPosts();
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
                setLikes(data.reverse());
            }
        } catch (error) {
            console.error("Error fetching likes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyPosts = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch("http://localhost:5011/api/community/my-posts", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMyPosts(data);
            }
        } catch (error) {
            console.error("Error fetching my posts:", error);
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
        <div className="w-full max-w-4xl mx-auto pt-20 mb-2">
            {/* Header */}
            <div className="text-center mb-12 mx-4">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-amber-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                    <span className="text-4xl font-bold text-black">{user?.name?.charAt(0) || "U"}</span>
                </div>
                <h1 className={`text-4xl font-extrabold mb-2 tracking-tight ${darkMode ? "text-white/90" : "text-gray-900"}`}>
                    {user?.name || "Your Profile"}
                </h1>
                <p className={`${darkMode ? "text-zinc-400" : "text-gray-600"}`}>Your personal collection of gems</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-12 mx-4">
                <div
                    onClick={() => setActiveTab("likes")}
                    className={`p-6 rounded-2xl border text-center cursor-pointer transition-colors ${activeTab === "likes" ? (darkMode ? "bg-white/10 border-yellow-500/50" : "bg-yellow-50 border-yellow-500") : (darkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50")}`}
                >
                    <div className="text-3xl font-bold text-yellow-500 mb-1">{likes.length}</div>
                    <div className={`text-xs uppercase tracking-wider ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>Liked Shayaris</div>
                </div>
                <div
                    onClick={() => setActiveTab("posts")}
                    className={`p-6 rounded-2xl border text-center cursor-pointer transition-colors ${activeTab === "posts" ? (darkMode ? "bg-white/10 border-blue-500/50" : "bg-blue-50 border-blue-500") : (darkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50")}`}
                >
                    <div className="text-3xl font-bold text-blue-500 mb-1">{myPosts.length}</div>
                    <div className={`text-xs uppercase tracking-wider ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>Shared Gems</div>
                </div>
            </div>

            {/* Tabs Header */}
            <div className="flex items-center gap-6 mb-8 mx-4 border-b border-gray-200 dark:border-white/10 pb-2">
                <button
                    onClick={() => setActiveTab("likes")}
                    className={`text-xl font-bold flex items-center gap-2 pb-2 transition-colors relative ${activeTab === "likes" ? (darkMode ? "text-yellow-400" : "text-yellow-600") : (darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-gray-400 hover:text-gray-600")}`}
                >
                    <Heart className={`w-5 h-5 ${activeTab === "likes" ? "fill-current" : ""}`} />
                    Liked Collection
                    {activeTab === "likes" && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-current" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("posts")}
                    className={`text-xl font-bold flex items-center gap-2 pb-2 transition-colors relative ${activeTab === "posts" ? "text-blue-500" : (darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-gray-400 hover:text-gray-600")}`}
                >
                    <PenBox className="w-5 h-5" />
                    My Shared Gems
                    {activeTab === "posts" && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-current" />
                    )}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-zinc-500 mx-4">Loading your collection...</div>
            ) : activeTab === "likes" ? (
                // Likes List
                likes.length === 0 ? (
                    <div className={`text-center py-20 mx-4 rounded-2xl border border-dashed ${darkMode ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-200"}`}>
                        <Heart className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                        <p className="text-zinc-400">No liked shayaris yet.</p>
                        <p className="text-sm text-zinc-500 mt-2">Go explore and like some magic!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4">
                        {likes.map((item, index) => (
                            <motion.div
                                key={item._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 rounded-xl border transition-all group relative overflow-hidden ${darkMode ? "bg-white/5 border-white/5 hover:border-white/10" : "bg-white border-gray-200 hover:border-gray-300"}`}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={() => copyToClipboard(item.text)}
                                        className={`p-2 rounded-full transition-colors ${darkMode ? "bg-black/50 hover:bg-yellow-500 hover:text-black" : "bg-gray-100 hover:bg-yellow-500 hover:text-white"}`}
                                        title="Copy"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteLike(item._id)}
                                        className={`p-2 rounded-full transition-colors ${darkMode ? "bg-black/50 hover:bg-red-500 hover:text-white" : "bg-gray-100 hover:bg-red-500 hover:text-white"}`}
                                        title="Remove from favorites"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className={`text-lg leading-relaxed font-serif whitespace-pre-line mb-4 ${darkMode ? "text-yellow-100/90" : "text-gray-800"}`}>
                                    {item.text}
                                </p>

                                <div className={`text-xs flex justify-between items-center mt-4 border-t pt-4 ${darkMode ? "text-zinc-600 border-white/5" : "text-gray-500 border-gray-100"}`}>
                                    <span>{new Date(item.likedAt).toLocaleDateString()}</span>
                                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )
            ) : (
                // My Posts List (Shared Gems)
                myPosts.length === 0 ? (
                    <div className={`text-center py-20 mx-4 rounded-2xl border border-dashed ${darkMode ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-200"}`}>
                        <PenBox className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                        <p className="text-zinc-400">You haven't shared anything yet.</p>
                        <p className="text-sm text-zinc-500 mt-2">Compose a masterpiece and share it with the world!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4">
                        {myPosts.map((item, index) => (
                            <motion.div
                                key={item._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 rounded-xl border transition-all group relative overflow-hidden ${darkMode ? "bg-white/5 border-white/5 hover:border-white/10" : "bg-white border-gray-200 hover:border-gray-300"}`}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={() => copyToClipboard(item.text)}
                                        className={`p-2 rounded-full transition-colors ${darkMode ? "bg-black/50 hover:bg-blue-500 hover:text-white" : "bg-gray-100 hover:bg-blue-500 hover:text-white"}`}
                                        title="Copy"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className={`text-lg leading-relaxed font-serif whitespace-pre-line mb-4 ${darkMode ? "text-yellow-100/90" : "text-gray-800"}`}>
                                    {item.text}
                                </p>

                                <div className={`text-xs flex justify-between items-center mt-4 border-t pt-4 ${darkMode ? "text-zinc-600 border-white/5" : "text-gray-500 border-gray-100"}`}>
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    <div className="flex items-center gap-1 text-red-500">
                                        <Heart className="w-3 h-3 fill-current" />
                                        <span>{item.likes?.length || 0} Likes</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )
            )
            }
        </div >
    );
}
