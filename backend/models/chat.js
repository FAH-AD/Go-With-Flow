import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
