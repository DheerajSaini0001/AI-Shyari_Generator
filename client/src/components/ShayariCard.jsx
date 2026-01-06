import { motion } from "framer-motion";
import { Copy, Heart, Share2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ShayariCard({ shayari, onLike, onShare, onCopy, isLiked }) {
    const { theme } = useTheme();
    const darkMode = theme === "dark";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="text-center relative"
        >
            <div className="mb-6 opacity-80">
                <span className={`text-6xl font-serif ${darkMode ? "text-yellow-500/20" : "text-yellow-600/30"}`}>"</span>
            </div>

            <p className={`text-2xl md:text-3xl font-medium leading-relaxed whitespace-pre-line font-serif ${darkMode ? "text-yellow-100" : "text-gray-800"}`}>
                {shayari}
            </p>

            <div className="mt-6 opacity-80">
                <span className={`text-6xl font-serif ${darkMode ? "text-yellow-500/20" : "text-yellow-600/30"}`}>"</span>
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={onCopy}
                    className={`p-3 rounded-full transition-colors ${darkMode ? "bg-zinc-800 hover:bg-zinc-700 hover:text-yellow-400" : "bg-gray-100 hover:bg-gray-200 hover:text-yellow-600 border border-gray-200"}`}
                    title="Copy"
                >
                    <Copy className="w-5 h-5" />
                </button>

                <button
                    onClick={onLike}
                    className={`p-3 rounded-full transition-colors ${isLiked
                        ? "bg-red-500/20 text-red-500"
                        : darkMode ? "bg-zinc-800 hover:bg-zinc-700 hover:text-red-400" : "bg-gray-100 hover:bg-gray-200 hover:text-red-500 border border-gray-200"}`}
                    title="Like"
                >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                </button>

                <button
                    onClick={onShare}
                    className={`p-3 rounded-full transition-colors ${darkMode ? "bg-zinc-800 hover:bg-zinc-700 hover:text-blue-400" : "bg-gray-100 hover:bg-gray-200 hover:text-blue-600 border border-gray-200"}`}
                    title="Share via..."
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
