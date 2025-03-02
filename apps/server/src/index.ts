import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

const users: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log(`✅ A user connected: ${socket.id}`);

  socket.on("join room", (room) => {
    socket.join(room);
    users[socket.id] = room;
    socket.broadcast.to(room).emit("user joined", `${socket.id} joined the room`);
    console.log(`📌 User ${socket.id} joined room: ${room}`);
  });

  socket.on("chat message", ({ room, message }) => {
    io.to(room).emit("chat message", { sender: socket.id, message });
    console.log(`📩 Message in Room ${room}: ${message}`);
  });

  socket.on("disconnect", () => {
    const room = users[socket.id];
    if (room) {
      socket.broadcast.to(room).emit("user left", `${socket.id} left the chat`);
      console.log(`❌ User ${socket.id} left room: ${room}`);
      delete users[socket.id];
    }
  });
});

server.listen(4000, () => {
  console.log("🚀 Server running at http://localhost:4000");
});
