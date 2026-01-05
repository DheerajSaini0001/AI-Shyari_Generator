import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['success', 'info', 'error'], default: 'info' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
