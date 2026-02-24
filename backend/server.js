import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config({path: "./.env"});

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

import express from "express";

const app = express();

const allowedOrigins = [
  "https://alumniconnectportal-i56ilu127-pratishtha-somanis-projects.vercel.app",
  "https://alumniconnectportal-62abmkbyd-pratishtha-somanis-projects.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      origin.endsWith(".vercel.app") ||
      origin === "http://localhost:3000"
    ) {
      return callback(null, true);
    }

    callback(new Error("CORS blocked"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));



app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create server instance for socket.io
const server = http.createServer(app);

// Socket.io setup (FIRST create io)
const io = new Server(server, {
  cors: {
    origin: "*", // you can restrict later
    methods: ["GET", "POST"]
  }
});

io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return next(new Error("Not authenticated"));

    const tokenCookie = cookieHeader
      .split("; ")
      .find(c => c.startsWith("token="));

    if (!tokenCookie) return next(new Error("No token"));

    const token = tokenCookie.split("=")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded; // { id, role }
    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
});

// Socket event handlers (AFTER io.use)
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.user.id);

  socket.on("joinRoom", ({ receiverId }) => {
    const senderId = socket.user.id;
    const roomId = [senderId, receiverId].sort().join("_");
    socket.join(roomId);
  });

  socket.on("sendMessage", ({ receiverId, message }) => {
    const senderId = socket.user.id;
    const roomId = [senderId, receiverId].sort().join("_");

    io.to(roomId).emit("newMessage", {
      senderId,
      receiverId,
      message
    });
  });

  socket.on("joinGroupRoom", ({ groupId }) => {
    socket.join(`group_${groupId}`);
  });

  socket.on("sendGroupMessage", ({ groupId, message }) => {
    io.to(`group_${groupId}`).emit("newGroupMessage", {
      senderId: socket.user.id,
      groupId,
      message
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.user.id);
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

const PORT = process.env.PORT || 8080;

console.log("EMAIL ENV CHECK:", process.env.EMAIL_USER, process.env.EMAIL_PASS ? "PASS_OK" : "PASS_MISSING");

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


