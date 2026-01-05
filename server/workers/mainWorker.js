import { parentPort, workerData } from "worker_threads";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const { task, data } = workerData;

const processTask = async () => {
    try {
        switch (task) {
            case "hashPassword":
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(data.password, salt);
                parentPort.postMessage({ data: hashedPassword });
                break;

            case "sendEmail":
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: data.auth.user,
                        pass: data.auth.pass,
                    },
                });

                const mailOptions = {
                    from: `"अल्फाज़" <${data.auth.user}>`,
                    to: data.to,
                    subject: data.subject,
                    html: data.html,
                };

                await transporter.sendMail(mailOptions);
                parentPort.postMessage({ data: "Email sent successfully" });
                break;

            case "generateShayari":
                if (!data.apiKey) throw new Error("API Key missing");

                const genAI = new GoogleGenerativeAI(data.apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

                const result = await model.generateContent(data.prompt);
                const response = await result.response;
                const text = response.text();

                parentPort.postMessage({ data: text });
                break;

            default:
                throw new Error(`Unknown task: ${task}`);
        }
    } catch (error) {
        parentPort.postMessage({ error: error.message });
    }
};

processTask();
