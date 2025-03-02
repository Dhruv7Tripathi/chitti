import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export const useSocket = (room: string) => {
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.emit("join room", room);

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Connected to server");
    });

    socket.on("user joined", (message) => {
      console.log(message);
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    socket.on("chat message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user left", (message) => {
      console.log(message);
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("user joined");
      socket.off("chat message");
      socket.off("user left");
    };
  }, [room]);

  const sendMessage = (message: string) => {
    socket.emit("chat message", { room, message });
  };

  return { messages, sendMessage, isConnected };
};
