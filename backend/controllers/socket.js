import { Server } from "socket.io";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Chat from "../models/chat.js"; // Chat schema
import User from "../models/user.js"; // User schema (added import)

dotenv.config(); // Load environment variables

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // React frontend URL
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);

        socket.on("joinRoom", ({ jobId }) => {
            if (!jobId) return;
            socket.join(jobId);
            console.log(`User joined room: ${jobId}`);
        });

        socket.on("sendMessage", async (data) => {
            const { jobId, clientId, freelancerId, senderId, text, clientName } = data;

            if (!jobId || !clientId || !freelancerId || !senderId || !text) {
                console.error(" Missing required fields in chat message:", data);
                return;
            }

            try {
                let chat = await Chat.findOne({ jobId, clientId, freelancerId });

                // If chat doesn't exist, create a new one
                if (!chat) {
                    chat = new Chat({
                        jobId,
                        clientId,
                        freelancerId,
                        messages: [{ senderId, text }]
                    });

                    // Send email notification for the first message
                    await sendEmailNotification(freelancerId, clientName);
                } else {
                    await sendEmailNotification(freelancerId, clientName);
                    chat.messages.push({ senderId, text });

                }

                // Save chat to database
                await chat.save();

                // Emit message to the room
                io.to(jobId).emit("receiveMessage", data);
                console.log(" Message sent to room:", jobId);
            } catch (error) {
                console.error(" Error handling chat message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

// Send Email Notification to Freelancer
const sendEmailNotification = async (freelancerId, clientName) => {
    try {

        // Fetch freelancer email
        const freelancer = await User.findById(freelancerId);
        if (!freelancer || !freelancer.email) {
            console.error(" Freelancer email not found");
            return;
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Read from .env
                pass: process.env.EMAIL_PASS  // Read from .env
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: freelancer.email,
            subject: "New Message from a Client",
            text: `Hello, you have received a new message from ${clientName}. Log in to your account to reply!`
        };

        await transporter.sendMail(mailOptions);
        console.log(" Email sent successfully to:", freelancer.email);
    } catch (error) {
        console.error(" Error sending email:", error);
    }
};

export { initializeSocket, getIo };
