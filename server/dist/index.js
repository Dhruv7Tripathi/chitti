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
    const { userId, username } = socket.handshake.query;

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

    socket.on("send-message", async ({ message, roomId, }) => {
        try {
            if (message && userId && roomId) {
                await axios.post(`$ http:localhost:3000/api/messages`, {
                    text: message,
                    senderId: userId,
                    sender: username,
                    roomId,
                });
                const createdAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

                io.to(roomId).emit("receive-message", {
                    senderId: userId,
                    senderName: username,
                    message,
                    createdAt,
                });
                console.log(`Message sent from ${username} to ${roomId}: ${message}`);
            } else {
                console.log("Message, User ID, or Receiver ID is missing");
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }
    });

    socket.on("clear-chat", ({ roomId }) => {
        socket.to(roomId).emit("chat-cleared");
    });


    socket.on("disconnect", () => {
        //   // onlineUsers.forEach((user, key) => {
        //   //   if (user.socketId === socket.id) {
        //   //     onlineUsers.delete(key);
        //   //   }
        //   });

        console.log(`Disconnected: ${socket.id}`);
    });
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`server is running on post ${PORT}`));