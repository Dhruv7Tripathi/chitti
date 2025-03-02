"use client";
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("general");
  const [username, setUsername] = useState("User" + Math.floor(Math.random() * 1000));
  const { messages, sendMessage } = useSocket(room);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Chat Room</h2>
      <label>Room:</label>
      <select onChange={(e) => setRoom(e.target.value)} value={room}>
        <option value="general">General</option>
        <option value="tech">Tech</option>
      </select>

      <div
        style={{
          border: "1px solid black",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginTop: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ width: "100%", marginTop: "10px" }}
      />
      <button
        onClick={() => {
          sendMessage(message, username);
          setMessage("");
        }}
        style={{ marginTop: "5px" }}
      >
        Send
      </button>
    </div>
  );
}
