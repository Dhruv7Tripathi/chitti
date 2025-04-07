import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";



export const useSocket = (room: string) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (session?.user) {
      const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
        query: {
          userId: session.user.id,
          username: session.user.name,
        },
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log(`✅ Connected to socket server: ${newSocket.id}`);
      });

      newSocket.on("disconnect", () => {
        console.log(`Disconnected from socket server`);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [session?.user]);

  return socket;
};
// socket.on("previousMessages", (prevMessages) => {
//   setMessages(prevMessages);
// });

// socket.on("receiveMessage", (data) => {
//   setMessages((prev) => [...prev, data]);
// });

//   return () => {
//     socket.off("previousMessages");
//     socket.off("receiveMessage");
//   };
// }, [room]);

// const sendMessage = (message: string, sender: string) => {
//   socket.emit("sendMessage", { room, message, sender });
// };

// return { messages, sendMessage };
// };
// export default useSocket;