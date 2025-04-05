import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export const useSocket = (room: string) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  useEffect(() => {
    socket.emit("joinRoom", room);

    socket.on("previousMessages", (prevMessages) => {
      setMessages(prevMessages);
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, [room]);

  const sendMessage = (message: string, sender: string) => {
    socket.emit("sendMessage", { room, message, sender });
  };

  return { messages, sendMessage };
};
export default useSocket;