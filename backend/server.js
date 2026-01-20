import dotenv from "dotenv";
dotenv.config({path: "./.env"});

import express from "express";
import cors from "cors";
import http from "http";          // NEW
import { Server } from "socket.io"; // NEW

import authRoutes from "./src/auth/auth.routes.js";
import profileRoutes from "./src/profile/profile.routes.js";
import jobRoutes from "./src/jobs/job.routes.js";
import alumniRoutes from "./src/alumni/alumni.routes.js";
import messageRoutes from "./src/messages/message.routes.js";
import { authRequired } from "./src/middleware/authMiddleware.js";
import groupRoutes from "./src/groups/group.routes.js";
import resourceRoutes from "./src/resources/resource.routes.js";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
app.use(cors({
  origin: ["https://xxxx.netlify.app"],
  credentials: true
}));

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create server instance for socket.io
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",   // later restrict to frontend domain
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Joining private chat room
  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("_");
    socket.join(roomId);
  });

  // Handle sending messages
  socket.on("sendMessage", (data) => {
    const roomId = [data.senderId, data.receiverId].sort().join("_");
    io.to(roomId).emit("newMessage", data); // Broadcast to both users
  });

  // Join Group Chat Room
socket.on("joinGroupRoom", ({ groupId }) => {
  socket.join(`group_${groupId}`);
});

// Group message
socket.on("sendGroupMessage", (data) => {
  io.to(`group_${data.groupId}`).emit("newGroupMessage", data);
});

socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../Frontend")));


app.get("/", (req, res) => {
  res.send("Backend is running with Socket.io!");
});

const PORT = process.env.PORT || 5001;

console.log("EMAIL ENV CHECK:", process.env.EMAIL_USER, process.env.EMAIL_PASS ? "PASS_OK" : "PASS_MISSING");

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


