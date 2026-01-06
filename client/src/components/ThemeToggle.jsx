import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative w-16 h-8 rounded-full flex items-center px-1
        transition-all duration-500 ease-in-out
        ${darkMode
          ? "bg-gradient-to-r from-zinc-800 to-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          : "bg-gradient-to-r from-yellow-300 to-amber-400 shadow-[0_0_20px_rgba(255,193,7,0.6)]"}
      `}
    >
      {/* Sliding Knob */}
      <span
        className={`absolute w-6 h-6 rounded-full flex items-center justify-center
          transition-all duration-500 ease-in-out
          ${darkMode
            ? "translate-x-8 bg-zinc-950 text-yellow-300"
            : "translate-x-0 bg-white text-amber-500"}
        `}
      >
        {darkMode ? <Moon size={14} /> : <Sun size={14} />}
      </span>

      {/* Background Icons */}
      <span className="absolute left-2 text-amber-600 opacity-70">
        <Sun size={14} />
      </span>
      <span className="absolute right-2 text-zinc-300 opacity-70">
        <Moon size={14} />
      </span>
    </button>
  );
}
