"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import axios from "axios";
import { CustomScrollArea } from "@/components/ui/custom-scroll-area";
import TypingBubble from "@/components/secondary/typingbubble";
import { ChatSkeleton, HeaderSkeleton, MessagesSkeleton } from "@/components/secondary/loadingskeletons";
import { NoMessagesBlock } from "@/components/secondary/status";
import { ChatHeader } from "@/components/secondary/chatheader";
import ChatInput from "@/components/secondary/chatinput";
import MessageBubble from "@/components/secondary/messagebubble";
import useRequireAuth from "@/hooks/useRequireAuth";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function ChatRoom() {
  useRequireAuth();
  const router = useRouter();
  const socket = useSocket();
  const { roomId } = useParams();
  const { data: session, status } = useSession();

  const [receiver, setReceiver] = useState();
  const [receiverImage, setReceiverImage] = useState();
  const [hasMounted, setHasMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<{
    sender: string;
    senderId: string;
    text: string;
    createdAt: string;
  }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [viewportHeight, setViewportHeight] = useState("100vh");
  const [socketConnected, setSocketConnected] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleMobileSidebar = () => {
    const event = new CustomEvent('toggle-mobile-sidebar');
    document.dispatchEvent(event);
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(`${window.innerHeight}px`);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    const [id1, id2] = decodeURIComponent(
      Array.isArray(roomId) ? roomId.join("") : roomId ?? ""
    ).split("$");

    const fetchUserById = async (userId: string) => {
      try {
        const response = await axios.get(`/api/userdetails/${userId}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.warn("User not found, redirecting to sign in...");
          router.push("/signin");
        } else {
          console.error("Error fetching user data:", error);
        }
        return null;
      }
    };

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/messages?roomId=${encodeURIComponent(
            Array.isArray(roomId) ? roomId.join("") : roomId || ""
          )}`
        );
        const data = response.data;
        setMessages(
          data.map(
            (msg: {
              sender: string;
              text: string;
              senderId: string;
              createdAt: Date;
            }) => ({
              sender: msg.sender,
              senderId: msg.senderId,
              text: msg.text,
              createdAt: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
            })
          )
        );
        scrollToBottom();

        const user1 = await fetchUserById(id1);
        const user2 = await fetchUserById(id2);

        if (!user1 || !user2) {
          router.push("/signin");
          return;
        }

        const receiverName =
          session.user.id === id1 ? user2?.name ?? "Loading.." : user1?.name ?? "Loading..";
        const receiverImg =
          session.user.id === id1 ? user2?.image ?? "" : user1?.image ?? "";

        setReceiver(receiverName);
        setReceiverImage(receiverImg);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId, session, status, router]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit("join-room", { roomId });

      socket.on("receive-message", ({ sender, senderId, message, createdAt }) => {
        setMessages((prev) => [
          ...prev,
          {
            sender,
            senderId,
            text: message,
            createdAt: new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          },
        ]);
      });

      socket.on("user-typing", ({ sender }) => {
        setTypingUser(sender);
        setIsTyping(true);
      });

      socket.on("user-stopped-typing", () => {
        setTypingUser(null);
        setIsTyping(false);
      });

      return () => {
        socket.off("receive-message");
        socket.off("user-typing");
        socket.off("user-stopped-typing");
      };
    }
  }, [socket, roomId, session?.user.id]);

  useEffect(() => {
    if (socket) {
      socket.on("connected", () => {
        setSocketConnected(true);
        console.log("Socket connection established");
      });

      return () => {
        socket.off("connected");
      };
    }
  }, [socket]);

  const handleTyping = () => {
    socket?.emit("typing", {
      roomId,
      sender: session?.user?.name,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stop-typing", {
        roomId,
        sender: session?.user?.name,
      });
    }, 1000);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const sender = session?.user.name || "Anonymous";
    const senderId = session?.user.id || "unknown";

    if (!socketConnected) {
      console.log("Waiting for socket to be ready...");
      setTimeout(() => sendMessage(), 100);
      return;
    }

    socket?.emit("send-message", {
      message,
      sender,
      senderId,
      roomId,
    });

    setMessage("");
    console.log("Message sent:", message);
  };

  const scrollToBottom = (smooth: boolean = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [loading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || status === "loading") {
    return <ChatSkeleton />;
  }

  if (!session) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex flex-col bg-neutral-950 flex-1 overflow-hidden w-full" style={{ height: viewportHeight }}>
      <div className="p-3 border-b border-neutral-900 flex items-center justify-between bg-neutral-950 shadow-sm z-10">
        {isMobile && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={toggleMobileSidebar}>
            <Menu size={20} className="text-neutral-400" />
          </Button>
        )}
        <div className="flex-1">
          {loading ? <HeaderSkeleton /> : <ChatHeader receiverImage={receiverImage || ""} receiver={receiver || ""} />}
        </div>

      </div>

      <div className="flex-1 overflow-hidden relative">
        <CustomScrollArea
          className="h-full bg-neutral-900"
          style={{
            backgroundImage: `url(/background.jpeg)`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
          }}
        >
          <div className="space-y-4 py-4 px-3">
            {loading ? (
              <MessagesSkeleton />
            ) : messages.length === 0 ? (
              <NoMessagesBlock />
            ) : (
              messages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  text={msg.text}
                  createdAt={msg.createdAt}
                  isSender={msg.senderId === session?.user.id}
                />
              ))
            )}
            {isTyping && typingUser && <TypingBubble />}
            <div ref={messagesEndRef} />
          </div>
        </CustomScrollArea>
      </div>

      <div className="p-3 bg-neutral-950 border-t border-neutral-900">
        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          handleTyping={handleTyping}
          handleKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

