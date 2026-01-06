import express from "express";
import openai from "../utils/openai.js";

const router = express.Router();

import { runWorkerTask } from "../utils/workerHandler.js";
import CommunityShayari from "../models/CommunityShayari.js";

router.post("/generate", async (req, res) => {
    const { mood, purpose, personality, depth } = req.body;

    console.log("Request received:", { mood, purpose, personality, depth });

    // Random flavors to ensure unique generation every time
    const themes = [
        // 🌙 Nature & Cosmos
        "Use a metaphor about the moon (चाँद).",
        "Use stars and the night sky to symbolize destiny or distance (सितारे).",
        "Use the sun as a symbol of hope or separation (सूरज).",
        "Use the sky to represent freedom or longing (आसमान).",
        "Use clouds to show uncertainty or hidden emotions (बादल).",
        "Use rain as a symbol of emotion, pain, or romance (बारिश).",
        "Use storms or thunder to express inner conflict (तूफ़ान).",
        "Use dawn or sunrise as new beginnings (सवेरा).",
        "Use sunset to represent endings or unspoken goodbyes (ढलती शाम).",

        // 🌊 Water & Flow
        "Focus on the feeling of emotional flow (बहाव).",
        "Use imagery of the ocean to express depth of feelings (समंदर).",
        "Use a river as a symbol of life’s journey (नदी).",
        "Use waves to show emotional ups and downs (लहरें).",
        "Use rain drops as metaphors for tears or memories (बूँदें).",
        "Use drowning or floating to show emotional states (डूबना/तैरना).",

        // 🌬️ Air & Motion
        "Refer to the wind or breeze as a messenger of memories (हवा).",
        "Use breath as a symbol of life and longing (साँसें).",
        "Use flying birds to represent freedom or escape (परिंदे).",
        "Use falling leaves to show fading emotions (गिरते पत्ते).",
        "Use footsteps or echoes to symbolize memories (कदमों की आहट).",

        // 👁️ Human Emotions & Body
        "Focus on eyes or gaze that speak unspoken feelings (नज़र).",
        "Use tears as silent confessions of pain or love (आँसू).",
        "Use a smile to hide pain or strength (मुस्कान).",
        "Use heartbeat as a symbol of love or fear (धड़कन).",
        "Use touch and distance to express emotional contrast (छूना/दूरी).",
        "Use lips and silence between words (लबों की ख़ामोशी).",

        // 🪞 Inner Self & Reflection
        "Use a mirror to show self-reflection or hidden truth (आईना).",
        "Use shadows to represent the hidden self (साया).",
        "Use dreams as symbols of desire or regret (ख़्वाब).",
        "Use sleep or insomnia as an emotional state (नींद).",
        "Use loneliness as a silent companion (तन्हाई).",
        "Use memories as haunting echoes of the past (यादें).",

        // ⏳ Time, Fate & Philosophy
        "Focus on the concept of time changing everything (वक़्त).",
        "Use waiting as devotion or emotional pain (इंतज़ार).",
        "Use destiny or fate as an unseen force (क़िस्मत).",
        "Use the past as a wound or lesson (बीता कल).",
        "Use the future as hope or fear (आने वाला कल).",
        "Use fleeting moments as fragile memories (लम्हे).",

        // 🌸 Love, Beauty & Fragility
        "Use a flower as a symbol of fragile love (फूल).",
        "Use fragrance as a lingering memory of someone (खुशबू).",
        "Use a garden to show growth in relationships (बाग़).",
        "Use thorns to represent pain within love (काँटे).",
        "Use a candle or flame to show burning love (शमा).",
        "Use ashes to represent love after loss (राख).",

        // 🔥 Pain, Loss & Depth
        "Use broken glass as a metaphor for shattered trust (टूटे शीशे).",
        "Use wounds as emotional scars (ज़ख़्म).",
        "Use darkness to represent fear or depression (अंधेरा).",
        "Use silence after goodbye (अलविदा की चुप्पी).",
        "Use emptiness to show loss or absence (खालीपन).",
        "Use echoes to represent unanswered love (गूंज)."
    ];

    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    const prompt = `
You are an expert Hindi Shayari writer with a Pakistani poetic style.

Mood: ${mood}
Purpose: ${purpose}
Tone/Personality: ${personality}
Emotional Depth: ${depth}

Random Context to make it unique: ${randomTheme}
Seed: ${Date.now()} (Ensure distinct output from previous requests)

Task:
Write a short, original shayari (2–4 lines).

Style Guidelines:
- Pakistani Urdu Shayari influence
- Soft, elegant, soulful expression
- Urdu-touch words allowed (ishq, khamoshi, yaadein, wafaa, tanhaai, dard)
- Natural rhythm and depth like classical mushaira shayari

Rules:
- Hindi / Hinglish  mix allowed
- No emojis
- Avoid clichés and copied verses
- End with an emotionally impactful line
- **Do NOT repeat previously generated verses.**
`;


    try {
        // Worker Thread: Generate Shayari
        const result = await runWorkerTask("generateShayari", {
            apiKey: process.env.GEMINI_API_KEY,
            prompt: prompt
        });

        // Auto-publish to Community Feed
        try {
            const communityPost = new CommunityShayari({
                text: result,
                authorName: "Generated by Alfaaz",
                status: "approved",
                expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Expires in 3 days
            });
            await communityPost.save();
            console.log("Auto-published to feed:", communityPost._id);
        } catch (postErr) {
            console.error("Failed to auto-publish:", postErr);
        }

        res.json({ shayari: result });
    } catch (err) {
        console.error("Worker Thread Error:", err.message);

        // Random Fallback Collection
        const fallbacks = [
            "कोशिश करने वालों की कभी हार नहीं होती,\nलहरों से डर कर नौका पार नहीं होती。"
        ];

        const randomShayari = fallbacks[Math.floor(Math.random() * fallbacks.length)];

        console.log("Using Random Static Fallback.");
        // Auto-publish fallback to Community Feed
        try {
            const communityPost = new CommunityShayari({
                text: randomShayari,
                authorName: "Generated by Alfaaz",
                status: "approved",
                expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Expires in 3 days
            });
            await communityPost.save();
            console.log("Auto-published fallback to feed:", communityPost._id);
        } catch (postErr) {
            console.error("Failed to auto-publish fallback:", postErr);
        }

        return res.json({
            shayari: randomShayari
        });
    }
});


import auth from "../middleware/auth.js";
import User from "../models/User.js";

// ... imports

router.post("/like", auth, async (req, res) => {
    const { shayari } = req.body;
    console.log(`[Like] User: ${req.user.userId}, Shayari: ${shayari?.substring(0, 20)}...`);

    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Add to liked array if not already present (optional check)
        user.likedShayaris.push({ text: shayari });
        await user.save();
        console.log("[Like] Saved successfully. Total likes:", user.likedShayaris.length);

        res.json({ message: "Shayari liked successfully!" });
    } catch (err) {
        console.error("[Like] Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/liked", auth, async (req, res) => {
    console.log(`[Get Liked] Request for user: ${req.user.userId}`);
    try {
        const user = await User.findById(req.user.userId).select("likedShayaris");
        if (!user) return res.status(404).json({ message: "User not found" });

        console.log(`[Get Liked] Found ${user.likedShayaris.length} items`);
        res.json(user.likedShayaris);
    } catch (err) {
        console.error("Error fetching liked shayaris:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/like/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.likedShayaris = user.likedShayaris.filter(s => s._id.toString() !== req.params.id);
        await user.save();

        res.json({ message: "Removed from favorites" });
    } catch (err) {
        console.error("Error removing like:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
