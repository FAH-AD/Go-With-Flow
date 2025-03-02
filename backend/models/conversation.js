import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Store message references
    createdAt: { type: Date, default: Date.now }
});

const ConversationModel = mongoose.model("Conversation", ConversationSchema);
export default ConversationModel;
