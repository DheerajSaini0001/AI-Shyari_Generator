import { motion } from "framer-motion";

export default function GlowButton({ loading, onClick, children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading}
      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold py-4 rounded-xl neon-glow disabled:opacity-50"
    >
      {children}
    </motion.button>
  );
}

