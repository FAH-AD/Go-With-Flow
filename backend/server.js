import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import cookieparser from "cookie-parser";
import multer from "multer";
import DbCon from "./utlis/db.js";
import AuthRoutes from "./routes/Auth.js";
import Upload from "./routes/Upload.js";
import jobRoutes from "./routes/jobRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { initializeSocket } from "./controllers/socket.js"; //  Correct socket import

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app); //  Ensure WebSocket is attached properly

//  MongoDB Connection
DbCon();

//  Middleware
app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend origin
    credentials: true, // Allow credentials (cookies, headers, etc.)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

//  Initialize WebSockets Correctly
initializeSocket(server); //  

//  API Routes
app.use("/api", AuthRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", Upload);
app.use("/api", clientRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/messages", messageRoutes);

//  File Upload Error Handling (Should be after all routes)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ success: false, message: err.message });
  } else {
    next(err);
  }
});

//  Start Server with WebSockets Attached
server.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
