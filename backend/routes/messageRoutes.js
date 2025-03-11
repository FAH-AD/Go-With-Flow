import express from "express";
import mongoose from "mongoose";
import Chat from "../models/chat.js";
import { getIo } from "../controllers/socet.js"; // Fix: Import getIo instead of initializeSocket


const router = express.Router();

// 🔹 Helper: Get or Create a Chat
const getOrCreateChat = async (jobId, clientId, freelancerId) => {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new Error("Invalid jobId format");
    }

    let chat = await Chat.findOne({ jobId: new mongoose.Types.ObjectId(jobId) });
    
    if (!chat) {
        chat = new Chat({
            jobId: new mongoose.Types.ObjectId(jobId),
            clientId: new mongoose.Types.ObjectId(clientId),
            freelancerId: new mongoose.Types.ObjectId(freelancerId),
            messages: [],
        });
        await chat.save();
    }
    return chat;
};

// 🔹 Start Chat (Ensures a chat room exists)
router.post("/start", async (req, res) => {
    const { jobId, clientId, freelancerId } = req.body;

   

    try {
        const chat = await getOrCreateChat(jobId, clientId, freelancerId);
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Get Messages for a Job
router.get("/:jobId", async (req, res) => {
    const { jobId } = req.params;

   
    try {
        const chat = await Chat.findOne({ jobId: new mongoose.Types.ObjectId(jobId) })
            .populate("messages.senderId", "name _id");
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.json(chat.messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/message", async (req, res) => {
    const { jobId, senderId, text } = req.body;
    try {
        const chat = await Chat.findOne({ jobId });
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const newMessage = { senderId, text, timestamp: new Date() };
        chat.messages.push(newMessage);
        await chat.save();

        res.status(200).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Send Message
// router.post("/message", async (req, res) => {
//     const { jobId, senderId, text } = req.body;

//     try {
//         const chat = await Chat.findOne({ jobId: new mongoose.Types.ObjectId(jobId) });

//         if (!chat) {
//             return res.status(404).json({ message: "Chat not found" });
//         }

//         const newMessage = {
//             senderId: new mongoose.Types.ObjectId(senderId),
//             text,
//             timestamp: new Date(),
//         };

//         chat.messages.push(newMessage);
//         await chat.save();

//         // ✅ Broadcast the message to everyone in the same chat room
//         const io = getIo();
//         io.to(jobId).emit("receiveMessage", newMessage); 

//         res.status(200).json(newMessage);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
export default router;
