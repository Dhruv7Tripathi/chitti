import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXTAUTH_URL || "*",
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

  if (userId && username) {
    console.log(`User connected: ${username} (ID: ${userId})`);
    socket.emit("connected");
  } else {
    console.log("User connected without ID or username");
    return;
  }

  socket.on("join-room", ({ roomId }) => {
    if (roomId && userId && username) {
      socket.join(roomId);
      console.log(`${username} joined room: ${roomId} (ID: ${userId})`);
      io.to(roomId).emit("user-joined", `${username} has joined the room.`);
    } else {
      console.log("Room ID, User ID, or Username is missing");
    }
  });

  socket.on("typing", ({ roomId, sender }) => {
    socket.to(roomId).emit("user-typing", { sender });
  });

  socket.on("stop-typing", ({ roomId, sender }) => {
    socket.to(roomId).emit("user-stopped-typing", { sender });
  });

  socket.on("send-message", async ({ message, roomId }) => {
    try {
      if (message && userId && roomId) {
        await axios.post(`${process.env.NEXTAUTH_URL}/api/messages`, {
          text: message,
          senderId: userId,
          sender: username,
          roomId,
        });

        const createdAt = new Date().toISOString();

        io.to(roomId).emit("receive-message", {
          senderId: userId,
          sender: username,
          message,
          createdAt,
        });

        console.log(`Message sent from ${username} to ${roomId}: ${message}`);
      } else {
        console.log("Message, User ID, or Room ID is missing", {
          message,
          userId,
          roomId,
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  // socket.on("clear-chat", ({ roomId }) => {
  //   socket.to(roomId).emit("chat-cleared");
  // });

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`server is running on port ${PORT}`)
);
