import mongoose from "mongoose";

const communityShayariSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, index: { expires: 0 } } // TTL Index: Documents expire when this date is reached
});

export default mongoose.model("CommunityShayari", communityShayariSchema);
