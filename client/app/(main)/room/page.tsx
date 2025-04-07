"use client";
import { useState } from "react";
// import { useSocket } from "../../hooks/useSocket";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("general");
  const [username] = useState("User" + Math.floor(Math.random() * 1000));
  // const { messages, sendMessage } = useSocket(room);

  const handleSend = () => {
    if (message.trim()) {
      // sendMessage(message, username);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-indigo-600 p-4 shadow-md">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Chat Room</h1>
          <div className="flex items-center">
            <label className="text-indigo-100 mr-2">Room:</label>
            <select
              onChange={(e) => setRoom(e.target.value)}
              value={room}
              className="bg-indigo-700 text-white rounded px-3 py-1 outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="general">General</option>
              <option value="tech">Tech</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden max-w-3xl w-full mx-auto p-4">
        <div className="flex flex-col h-full rounded-lg shadow-lg bg-white">
          {/* <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-xs ${msg.sender === username
                  ? "ml-auto bg-indigo-500 text-white"
                  : "mr-auto bg-gray-200 text-gray-800"
                  }`}
              >
                <div className="text-xs mb-1 font-semibold">{msg.sender}</div>
                <div>{msg.text}</div>
              </div>
            ))}
          </div> */}

          <div className="border-t p-3">
            <div className="flex rounded-lg border overflow-hidden">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700 transition duration-150"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
