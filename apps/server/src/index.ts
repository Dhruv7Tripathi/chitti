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
      where: { roomId: room },
      orderBy: { createdAt: "asc" },
    });

    socket.emit("previousMessages", messages);
  });

  socket.on("sendMessage", async ({ room, message, sender }) => {
    console.log(`📩 Message in Room ${room}: ${message}`);

    // Save message to database
    const savedMessage = await prisma.message.create({
      data: { room, text: message },
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

// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { authenticateUser } from "../middleware/authmiddleware";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json()); // Enable JSON parsing

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// const prisma = new PrismaClient();
// const SECRET_KEY = process.env.SECRET_KEY as string;

// // ============================
// // 🔹 User Authentication Routes
// // ============================

// // 🔹 Register User
// app.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     const user = await prisma.user.create({
//       data: { username, email, password },
//     });

//     res.status(201).json({ message: "User registered successfully", user });
//   } catch (error) {
//     res.status(400).json({ error: "Error registering user" });
//   }
// });

// // 🔹 Login User
// app.post("/login", async (req : any , res : any) => {
//   const { email, password } = req.body;
//   try {
//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
//     res.json({ message: "Login successful", token });
//   } catch (error) {
//     res.status(500).json({ error: "Error logging in" });
//   }
// });

// // ============================
// // 🔹 Room Routes
// // ============================

// // 🔹 Create Room (Requires Authentication)

// app.post("/rooms", authenticateUser , async (req, res) => {
//   const { name } = req.body;
//   try {
//     const room = await prisma.room.create({ data: { name } });
//     res.status(201).json(room);
//   } catch (error) {
//     res.status(400).json({ error: "Error creating room" });
//   }
// });

// // 🔹 Get All Rooms
// app.get("/rooms", async (req, res) => {
//   try {
//     const rooms = await prisma.room.findMany();
//     res.json(rooms);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching rooms" });
//   }
// });

// // ============================
// // 🔹 WebSocket Implementation
// // ============================
// io.on("connection", (socket) => {
//   console.log(`✅ A user connected: ${socket.id}`);

//   // 🔹 Join a Room
//   socket.on("joinRoom", async ({ roomId, userId }) => {
//     socket.join(roomId);
//     console.log(`📌 User ${userId} joined room: ${roomId}`);

//     // Fetch previous messages from DB
//     const messages = await prisma.message.findMany({
//       where: { roomId },
//       orderBy: { createdAt: "asc" },
//     });

//     socket.emit("previousMessages", messages);
//   });

//   // 🔹 Send Message
//   socket.on("sendMessage", async ({ roomId, senderId, text }) => {
//     console.log(`📩 Message in Room ${roomId}: ${text}`);

//     // Save message to database
//     const savedMessage = await prisma.message.create({
//       data: { roomId, senderId, text },
//     });

//     // Send message to everyone in the room
//     io.to(roomId).emit("receiveMessage", savedMessage);
//   });

//   // 🔹 Disconnect Event
//   socket.on("disconnect", () => {
//     console.log(`❌ User disconnected: ${socket.id}`);
//   });
// });

// // ============================
// // 🔹 Start Server
// // ============================
// server.listen(4000, () => {
//   console.log("🚀 Server running at http://localhost:4000");
// });
