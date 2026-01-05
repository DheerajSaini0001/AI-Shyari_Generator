import { motion } from "framer-motion";

export default function GlassPanel({ children, className }) {
  return (
    <motion.div
      whileHover={{ rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 120 }}
      className={`glass-panel rounded-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
