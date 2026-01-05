import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register with OTP
import { runWorkerTask } from "../utils/workerHandler.js";

// Register with OTP
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user && user.isVerified) return res.status(400).json({ message: "User already exists" });

        // Worker Thread: Hash Password
        const hashedPassword = await runWorkerTask("hashPassword", { password });

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        if (user) {
            user.name = name;
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            user = new User({
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpires
            });
            await user.save();
        }

        const message = `
      <h1>Verify your account</h1>
      <p>Your OTP is: <b style="font-size: 24px;">${otp}</b></p>
      <p>This code expires in 10 minutes.</p>
    `;

        try {
            // Worker Thread: Send Email
            // Note: We await here to ensure success before responding, but it runs in separate thread
            await runWorkerTask("sendEmail", {
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                to: user.email,
                subject: "Your OTP Code - अल्फाज़",
                html: message
            });

            res.status(201).json({ message: "OTP sent to your email", email });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Email could not be sent" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Verify Registration OTP
// Verify Registration OTP
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    // Log minimal info
    console.log(`[Verify] Email: ${email}, OTP: ${otp}`);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("[Verify] User not found");
            return res.status(400).json({ message: "User not found" });
        }

        // 1. Strict String Comparison (fixes type mismatch)
        if (String(user.otp).trim() !== String(otp).trim()) {
            console.log(`[Verify] Mismatch - DB: ${user.otp} vs Input: ${otp}`);
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // 2. Expiry Check
        if (user.otpExpires < Date.now()) {
            console.log("[Verify] OTP Expired");
            return res.status(400).json({ message: "OTP has expired" });
        }

        // 3. Success
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        console.log("[Verify] Success!");
        res.json({ message: "Email verified!", token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Login (Password)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first" });

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

// Request Login OTP
router.post("/login-otp-request", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const message = `
          <h1>Login OTP</h1>
          <p>Your Login OTP is: <b style="font-size: 24px;">${otp}</b></p>
          <p>Do not share this code.</p>
        `;

        await sendEmail({
            email: user.email,
            subject: "Login Key - अल्फाज़",
            html: message
        });

        res.json({ message: "OTP sent to email" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Verify Login OTP
// Verify Login OTP
router.post("/login-otp-verify", async (req, res) => {
    const { email, otp } = req.body;

    // Log minimal info
    console.log(`[Login Verify] Email: ${email}, OTP: ${otp}`);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("[Login Verify] User not found");
            return res.status(400).json({ message: "User not found" });
        }

        // 1. Strict String Comparison
        if (String(user.otp).trim() !== String(otp).trim()) {
            console.log(`[Login Verify] Mismatch - DB: ${user.otp} vs Input: ${otp}`);
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // 2. Expiry Check
        if (user.otpExpires < Date.now()) {
            console.log("[Login Verify] OTP Expired");
            return res.status(400).json({ message: "OTP has expired" });
        }

        // 3. Success
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        console.log("[Login Verify] Success!");
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// DEV ROUTE: Make me Admin
router.post("/dev/make-admin", async (req, res) => {
    const { email, secret } = req.body;
    if (secret !== "admin123") return res.status(403).json({ message: "Forbidden" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isAdmin = true;
        await user.save();
        res.json({ message: `User ${email} is now an Admin` });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
