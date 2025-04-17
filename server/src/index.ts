import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const CLIENT_URL = "https://chitti-bice.vercel.app";

if (!CLIENT_URL) {
  // console.error("❌ CLIENT_URL is not defined in your .env file.");
  process.exit(1);
}

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  const { userId, username } = socket.handshake.query as {
    userId?: string;
    username?: string;
  };

  if (!userId || !username) {
    console.log("❌ User connected without valid ID or username. Disconnecting...");
    socket.disconnect(true);
    return;
  }

  console.log(`✅ User connected: ${username} (ID: ${userId})`);
  socket.emit("connected");

  socket.on("join-room", ({ roomId }: { roomId: string }) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`➡️ ${username} joined room: ${roomId}`);
    io.to(roomId).emit("user-joined", `${username} has joined the room.`);
  });

  socket.on("typing", ({ roomId, sender }: { roomId: string; sender: string }) => {
    socket.to(roomId).emit("user-typing", { sender });
  });

  socket.on("stop-typing", ({ roomId, sender }: { roomId: string; sender: string }) => {
    socket.to(roomId).emit("user-stopped-typing", { sender });
  });

  socket.on("send-message", async ({
    message,
    roomId,
  }: {
    message: string;
    roomId: string;
  }) => {
    if (!message || !userId || !roomId) {
      console.log("❌ Missing data to send message", {
        message,
        userId,
        roomId,
      });
      return;
    }

    try {
      const apiUrl = `${CLIENT_URL}/api/messages`;
      console.log(`Sending message to API: ${apiUrl}`);

      await axios.post(apiUrl, {
        text: message,
        senderId: userId,
        sender: username,
        roomId,
      });

      const createdAt = new Date().toISOString();

      io.to(roomId).emit("receive-message", {
        senderId: userId,
        senderName: username,
        message,
        createdAt,
      });

      console.log(`📨 ${username} -> [${roomId}]: ${message}`);
    } catch (err) {
      console.error("Error sending message:", err);
      if (axios.isAxiosError(err)) {
        console.error("Request URL:", err.config?.url);
        console.error("Response status:", err.response?.status);
        // console.error("Response data:", err.response?.data);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`❎ Disconnected: ${username} (Socket ID: ${socket.id})`);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});