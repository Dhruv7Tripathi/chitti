"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
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
