import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import GlassPanel from "../components/GlassPanel";
import OptionButton from "../components/OptionButton";
import GlowButton from "../components/GlowButton";
import ShayariCard from "../components/ShayariCard";

export default function ShayariAI() {
  const options = {
    Mood: ["Happy", "Sad", "Romantic", "Motivational"],
    Depth: ["Light", "Medium", "Deep"],
  };

  const [form, setForm] = useState({
    Mood: "Happy",
    Depth: "Medium",
  });

  const [shayari, setShayari] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setShayari("");

    try {
      const response = await fetch("http://localhost:5011/api/shayari/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: form.Mood,
          depth: form.Depth,
          purpose: "General",
          personality: "Poetic"
        }),
      });

      const data = await response.json();
      if (data.shayari) {
        setShayari(data.shayari);
      }
    } catch (err) {
      console.error(err);
      setShayari("Error generating shayari. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="gradient-text">अल्फ़ाज़</span>
        </h1>

        <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
          Craft soulful poetry through the harmony of emotions and artificial intelligence
        </p>
      </motion.div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-10 mb-4">
        {/* CONTROLS */}
        <GlassPanel className="p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Object.entries(options).map(([key, values]) => (
              <div key={key} className="mb-8 text-left">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-4">
                  {key}
                </p>

                <div className="flex flex-wrap gap-3">
                  {values.map((v) => (
                    <OptionButton
                      key={v}
                      active={form[key] === v}
                      onClick={() =>
                        setForm({
                          ...form,
                          [key]: v,
                        })
                      }
                    >
                      {v}
                    </OptionButton>
                  ))}
                </div>
              </div>
            ))}

            <GlowButton loading={loading} onClick={generate}>
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Sparkles className="animate-spin" />
                  Creating poetry…
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Wand2 />
                  Generate Shayari
                </span>
              )}
            </GlowButton>
          </motion.div>
        </GlassPanel>

        {/* OUTPUT */}
        <GlassPanel className="p-8 min-h-[380px] flex items-center justify-center">
          {shayari ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <ShayariCard shayari={shayari} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-500 text-center"
            >
              <Sparkles
                className="mx-auto mb-5 opacity-30"
                size={52}
              />
              <p className="text-sm">
                Select your mood and depth<br />
                then let the magic unfold
              </p>
            </motion.div>
          )}
        </GlassPanel>
      </div>
    </>
  );
}
