import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shayariRoutes from "./routes/shayari.js";
import morgan from "morgan";
import helmet from "helmet";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5011;

// Connect to MongoDB
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai-shayari")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/shayari", shayariRoutes);

app.get("/", (req, res) => {
    res.send("AI Shayari Generator API is running 🚀");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
