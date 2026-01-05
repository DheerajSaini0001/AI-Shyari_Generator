import { useState } from "react";
import { Sparkles } from "lucide-react";
import GlassPanel from "../components/GlassPanel";
import OptionButton from "../components/OptionButton";
import GlowButton from "../components/GlowButton";
import ShayariCard from "../components/ShayariCard";

export default function ShayariAI() {
  const options = {
    mood: ["Happy", "Sad", "Motivated", "Romantic"],
    depth: ["Light", "Medium", "Deep"],
  };

  const [form, setForm] = useState({
    mood: "Happy",
    depth: "Medium",
  });

  const [shayari, setShayari] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setShayari("ख़ामोशी भी अब बातें करने लगी है...\nक्योंकि अल्फ़ाज़ AI ने चुन लिए हैं ✨");
      setLoading(false);
    }, 1200);
  };

  return (
    <>
      {/* HERO */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="gradient-text">अल्फ़ाज़</span> ✨
        </h1>
        <p className="text-zinc-400 mt-4">
          Soul-touching poetry powered by Artificial Intelligence
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* CONTROLS */}
        <GlassPanel className="p-8">
          {Object.entries(options).map(([key, values]) => (
            <div key={key} className="mb-6">
              <p className="text-sm uppercase text-zinc-400 mb-3">{key}</p>
              <div className="flex flex-wrap gap-2">
                {values.map(v => (
                  <OptionButton
                    key={v}
                    active={form[key] === v}
                    onClick={() => setForm({ ...form, [key]: v })}
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
                <Sparkles className="animate-spin" /> Generating...
              </span>
            ) : (
              "Generate Shayari"
            )}
          </GlowButton>
        </GlassPanel>

        {/* OUTPUT */}
        <GlassPanel className="p-8 min-h-[350px] flex items-center justify-center">
          {shayari ? (
            <ShayariCard shayari={shayari} />
          ) : (
            <div className="text-zinc-500 text-center">
              <Sparkles className="mx-auto mb-4 opacity-20" size={48} />
              Select options & generate magic ✨
            </div>
          )}
        </GlassPanel>
      </div>
    </>
  );
}

