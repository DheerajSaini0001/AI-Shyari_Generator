import express from "express";
import openai from "../utils/openai.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
    const { mood, purpose, personality, depth } = req.body;

    console.log("Request received:", { mood, purpose, personality, depth });

    const prompt = `
You are a Hindi Shayari writer.

Mood: ${mood}
Purpose: ${purpose}
Personality: ${personality}
Depth: ${depth}

Write a short, beautiful Hindi shayari (2–4 lines).
Pure Hindi / Hinglish allowed.
No emojis.
`;

    try {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
            // Mock response for testing without costing/key
            console.log("Using Mock Response (No API Key provided)");
            setTimeout(() => {
                res.json({
                    shayari: "कभी खामोशी भी चीख़ बन जाती है,\nजब ज़िंदगी सवाल और जवाब बन जाती है。"
                });
            }, 1000);
            return;
        }

        // Gemini Logic (Primary)
        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error("GEMINI_API_KEY is missing");
            }

            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            res.json({ shayari: text });
        } catch (geminiError) {
            console.error("Gemini Failure Details:", JSON.stringify(geminiError, null, 2));
            console.error("Gemini Error Message:", geminiError.message);

            // Random Fallback Collection
            const fallbacks = [
                "कोशिश करने वालों की कभी हार नहीं होती,\nलहरों से डर कर नौका पार नहीं होती。",
                "ख़ुदी को कर बुलंद इतना कि हर तक़दीर से पहले,\nख़ुदा बंदे से ख़ुद पूछे, बता तेरी रज़ा क्या है。",
                "मंजिलें उन्हीं को मिलती हैं, जिनके सपनों में जान होती है,\nपंखों से कुछ नहीं होता, हौसलों से उड़ान होती है。",
                "वक्त से लड़कर जो नसीब बदल दे,\nइंसान वही जो अपनी तकदीर बदल दे。",
                "तू रख यकीन बस अपने इरादों पर,\nतेरी हार तेरे हौसलों से बड़ी तो नहीं।"
            ];

            const randomShayari = fallbacks[Math.floor(Math.random() * fallbacks.length)];

            console.log("Using Random Static Fallback.");
            return res.json({
                shayari: randomShayari + "\n(AI unavailable - Cached Mode)"
            });
        }
    } catch (err) {
        console.error("Error generating Shayari:", err);
        res.status(500).json({ error: err.message || "Shayari generation failed" });
    }
});


import auth from "../middleware/auth.js";
import User from "../models/User.js";

router.post("/like", auth, async (req, res) => {
    const { shayari } = req.body;
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Add to liked array if not already present (optional check)
        user.likedShayaris.push({ text: shayari });
        await user.save();

        res.json({ message: "Shayari liked successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
