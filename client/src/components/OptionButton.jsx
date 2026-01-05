import { motion } from "framer-motion";

export default function OptionButton({ active, onClick, children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-sm transition-all
        ${active
          ? "bg-yellow-500 text-black border-yellow-400 neon-glow"
          : "bg-zinc-900/60 text-zinc-400 border-zinc-700 hover:border-zinc-500"
        }`}
    >
      {children}
    </motion.button>
  );
}
