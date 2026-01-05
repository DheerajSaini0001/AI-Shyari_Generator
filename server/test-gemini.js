
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC1tFod2EzUGRvwgOTYyyMJYdurIoX8Hp8";

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = "Write a 2 line shayari on coding.";
        console.log("Sending prompt...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:");
        console.log(text);
    } catch (error) {
        console.error("Error testing Gemini:");
        console.error(error);
    }
}

testGemini();
