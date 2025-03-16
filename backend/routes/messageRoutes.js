import express from "express";
import mongoose from "mongoose";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { authMiddleware,isClient,isFreelancer } from "../middleware/authMiddleware.js";
import { getIo } from "../controllers/socket.js"; // Fix: Import getIo instead of initializeSocket


const router = express.Router();
dotenv.config()

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

router.get("/chats",  authMiddleware(['client', 'freelancer']), async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized: Missing user ID" });
        }

        const userId = req.user._id.toString();

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid User ID" });
        }

        const userRole = req.user.role;
        const filter = userRole === "client" 
            ? { clientId: userId } 
            : { freelancerId: userId };

        const chats = await Chat.find(filter)
            .populate("clientId", "name email")
            .populate("freelancerId", "name email")
            .populate("messages.senderId", "name email");

        res.json({ success: true, chats });
    } catch (error) {
        console.error("Chat Fetch Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
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






// Middleware to authenticate user





export default router;
