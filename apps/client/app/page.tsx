"use client";
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function ChatPage() {
  const [room, setRoom] = useState("general");
  const { messages, sendMessage, isConnected } = useSocket(room);
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">💬 Chat Room: {room}</h1>
      <p className={`text-sm ${isConnected ? "text-green-500" : "text-red-500"}`}>
        {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </p>

      <input
        type="text"
        placeholder="Enter Room Name"
        className="p-2 border rounded"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <div className="w-96 h-64 border p-4 overflow-auto">
        {messages.map((msg, index) => (
          <p key={index} className={msg.sender === "system" ? "text-gray-500" : "text-black"}>
            <strong>{msg.sender === "system" ? "[System]" : msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type a message..."
        className="p-2 border rounded w-96"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim() !== "") {
            sendMessage(input);
            setInput("");
          }
        }}
      />

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => {
          if (input.trim() !== "") {
            sendMessage(input);
            setInput("");
          }
        }}
      >
        Send
      </button>
    </div>
  );
}
