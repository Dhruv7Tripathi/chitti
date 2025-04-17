"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
// const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const CLIENT_URL = "https://chitti-bice.vercel.app";
if (!CLIENT_URL) {
    // console.error("❌ CLIENT_URL is not defined in your .env file.");
    process.exit(1);
}
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: CLIENT_URL,
        credentials: true,
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
io.on("connection", (socket) => {
    const { userId, username } = socket.handshake.query;
    if (!userId || !username) {
        console.log("❌ User connected without valid ID or username. Disconnecting...");
        socket.disconnect(true);
        return;
    }
    console.log(`✅ User connected: ${username} (ID: ${userId})`);
    socket.emit("connected");
    socket.on("join-room", ({ roomId }) => {
        if (!roomId)
            return;
        socket.join(roomId);
        console.log(`➡️ ${username} joined room: ${roomId}`);
        io.to(roomId).emit("user-joined", `${username} has joined the room.`);
    });
    socket.on("typing", ({ roomId, sender }) => {
        socket.to(roomId).emit("user-typing", { sender });
    });
    socket.on("stop-typing", ({ roomId, sender }) => {
        socket.to(roomId).emit("user-stopped-typing", { sender });
    });
    socket.on("send-message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ message, roomId, }) {
        var _b, _c;
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
            yield axios_1.default.post(apiUrl, {
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
        }
        catch (err) {
            console.error("Error sending message:", err);
            if (axios_1.default.isAxiosError(err)) {
                console.error("Request URL:", (_b = err.config) === null || _b === void 0 ? void 0 : _b.url);
                console.error("Response status:", (_c = err.response) === null || _c === void 0 ? void 0 : _c.status);
                // console.error("Response data:", err.response?.data);
            }
        }
    }));
    socket.on("disconnect", () => {
        console.log(`❎ Disconnected: ${username} (Socket ID: ${socket.id})`);
    });
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
