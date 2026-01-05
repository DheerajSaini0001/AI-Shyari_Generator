import express from "express";
import auth from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for the current user
router.get("/", auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.userId })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
router.put("/:id/read", auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: "Notification not found" });

        // Ensure user owns the notification
        if (notification.recipient.toString() !== req.user.userId) {
            return res.status(401).json({ message: "Not authorized" });
        }

        notification.isRead = true;
        await notification.save();
        res.json({ message: "Marked as read" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
