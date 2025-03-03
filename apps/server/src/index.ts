// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import { PrismaClient } from "@prisma/client";

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// const prisma = new PrismaClient();

// io.on("connection", (socket) => {
//   console.log(`✅ A user connected: ${socket.id}`);

//   socket.on("joinRoom", async (room) => {
//     socket.join(room);
//     console.log(`📌 User ${socket.id} joined room: ${room}`);

//     // Fetch previous messages from DB
//     const messages = await prisma.message.findMany({
//       where: { room },
//       orderBy: { createdAt: "asc" },
//     });

//     socket.emit("previousMessages", messages);
//   });

//   socket.on("sendMessage", async ({ room, message, sender }) => {
//     console.log(`📩 Message in Room ${room}: ${message}`);

//     // Save message to database
//     const savedMessage = await prisma.message.create({
//       data: { room, text: message, sender },
//     });

//     // Send message to everyone in the room
//     io.to(room).emit("receiveMessage", savedMessage);
//   });

//   socket.on("disconnect", () => {
//     console.log(`❌ User disconnected: ${socket.id}`);
//   });
// });

// server.listen(4000, () => {
//   console.log("🚀 Server running at http://localhost:4000");
// });

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import prisma from "../config/prisma";
import { authenticateUser } from "../middleware/authmiddleware";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY as string;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.use(authenticateUser as any);

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.data.user.id}`);

  socket.on("joinRoom", async (room) => {
    socket.join(room);
    console.log(`📌 User ${socket.data.user.id} joined room: ${room}`);


    const messages = await prisma.message.findMany({
      where: { room },
      orderBy: { createdAt: "asc" },
    });

    socket.emit("previousMessages", messages);
  });

  socket.on("sendMessage", async ({ room, message }) => {
    console.log(`📩 Message in Room ${room}: ${message}`);

    const sender = socket.data.user.id;

    const savedMessage = await prisma.message.create({
      data: { room, text: message, sender },
    });

    io.to(room).emit("receiveMessage", savedMessage);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.data.user.id}`);
  });
});


app.post("/login", (req: any, res: any) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID required" });

  const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

server.listen(4000, () => {
  console.log("🚀 Server running at http://localhost:4000");
});
