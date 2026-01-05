import { motion } from "framer-motion";
import { Copy, Heart, Share2 } from "lucide-react";

export default function ShayariCard({ shayari, onLike, onShare, onCopy, isLiked }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="text-center relative"
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

            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={onCopy}
                    className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 hover:text-yellow-400 transition-colors"
                    title="Copy"
                >
                    <Copy className="w-5 h-5" />
                </button>

                <button
                    onClick={onLike}
                    className={`p-3 rounded-full transition-colors ${isLiked ? "bg-red-500/20 text-red-500" : "bg-zinc-800 hover:bg-zinc-700 hover:text-red-400"}`}
                    title="Like"
                >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                </button>

                <button
                    onClick={onShare}
                    className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 hover:text-blue-400 transition-colors"
                    title="Share via..."
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
