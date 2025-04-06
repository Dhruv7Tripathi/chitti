import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});


io.on("connection", (socket) => {
  console.log(`✅ A user connected: ${socket.id}`);

  //   socket.on("joinRoom", async (roomName) => {
  //     if (!roomName) {
  //       console.error("❌ Room name is undefined!");
  //       return;
  //     }

  //     socket.join(roomName);
  //     console.log(`📌 User ${socket.id} joined room: ${roomName}`);

  //     // const room = await prisma.room.findUnique({
  //     //   where: { name: roomName },
  //     // });

  //     // if (!room) {
  //     //   console.error(`❌ Room ${roomName} does not exist`);
  //     //   return;
  //     // }

  //     // const messages = await prisma.message.findMany({
  //     //   where: { roomId: room.id },
  //     //   orderBy: { createdAt: "asc" },
  //     // });

  //     // socket.emit("previousMessages", messages);
  //   });

  //   socket.on("sendMessage", async ({ roomName, message, senderId }) => {
  //     if (!roomName || !senderId || !message) {
  //       console.error("❌ Invalid message data received:", { roomName, senderId, message });
  //       return;
  //     }

  //     console.log(`📩 Message in Room ${roomName}: ${message}`);

  //     try {
  //       // const room = await prisma.room.findUnique({
  //       //   where: { name: roomName },
  //       // });

  //       // if (!room) {
  //       //   console.error(`❌ Room ${roomName} not found`);
  //       //   return;
  //       // }

  //       // const sender = await prisma.user.findUnique({
  //       //   where: { id: senderId },
  //       // });

  //       if (!sender) {
  //         console.error(`❌ Sender with ID ${senderId} not found`);
  //         return;
  //       }

  //       const savedMessage = await prisma.message.create({
  //         data: {
  //           text: message,
  //           sender: { connect: { id: senderId } },
  //           room: { connect: { id: room.id } },
  //         },
  //       });

  //       io.to(roomName).emit("receiveMessage", savedMessage);
  //     } catch (error) {
  //       console.error("🔥 Error sending message:", error);
  //     }
  //   });

  //   socket.on("disconnect", () => {
  //     console.log(`❌ User disconnected: ${socket.id}`);
  //   });
});

// server.listen(4000, () => {
//   console.log("🚀 Server running at http://localhost:4000");
// });
