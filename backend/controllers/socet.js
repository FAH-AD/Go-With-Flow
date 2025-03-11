import { Server } from "socket.io";

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // React frontend URL
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);

        socket.on("joinRoom", ({ jobId }) => {
            socket.join(jobId);
            console.log(`User joined room: ${jobId}`);
        });

        socket.on("sendMessage", (data) => {
            io.to(data.jobId).emit("receiveMessage", data);
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
export { initializeSocket, getIo };
