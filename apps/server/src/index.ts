import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const prisma = new PrismaClient();

io.on("connection", (socket) => {
  console.log(`✅ A user connected: ${socket.id}`);

  socket.on("joinRoom", async (room) => {
    socket.join(room);
    console.log(`📌 User ${socket.id} joined room: ${room}`);

    // Fetch previous messages from DB
    const messages = await prisma.message.findMany({
      where: { room },
      orderBy: { createdAt: "asc" },
    });

    socket.emit("previousMessages", messages);
  });

  socket.on("sendMessage", async ({ room, message, sender }) => {
    console.log(`📩 Message in Room ${room}: ${message}`);

    // Save message to database
    const savedMessage = await prisma.message.create({
      data: { room, text: message, sender },
    });

    // Send message to everyone in the room
    io.to(room).emit("receiveMessage", savedMessage);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log("🚀 Server running at http://localhost:4000");
});
