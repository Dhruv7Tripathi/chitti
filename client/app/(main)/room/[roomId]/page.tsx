"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import axios from "axios";
import { CustomScrollArea } from "@/components/ui/custom-scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TypingBubble from "@/components/typingbubble";
import { ChatSkeleton, HeaderSkeleton, MessagesSkeleton } from "@/components/loadingskeletons";
import { NoMessagesBlock } from "@/components/status";
import { ChatHeader } from "@/components/chatheader";
import ChatInput from "@/components/chatinput";
import MessageBubble from "@/components/messagebubble";
import useRequireAuth from "@/hooks/useRequireAuth";
import ChatSidebar from "@/components/chatsidebar";

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
  const [messages, setMessages] = useState<{ sender: string; text: string; createdAt: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [viewportHeight, setViewportHeight] = useState("100vh");
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return; // ✅ Wait until session is ready

    const [id1, id2] = decodeURIComponent(
      Array.isArray(roomId) ? roomId.join("") : roomId ?? ""
    ).split("$");

    const fetchUserById = async (userId: string) => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
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
              createdAt: Date;
            }) => ({
              sender: msg.sender,
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
          session.user.id === id1
            ? user2?.name ?? "Loading.."
            : user1?.name ?? "Loading..";
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

      socket.on("receive-message", ({ sender, message, createdAt }) => {
        const displayName =
          sender === session?.user.name
            ? session?.user.name || "You"
            : sender;
        setMessages((prev) => [
          ...prev,
          { sender: displayName, text: message, createdAt },
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
  }, [socket, roomId, session?.user.name]);

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

    if (!socketConnected) {
      console.log("Waiting for socket to be ready...");
      setTimeout(() => sendMessage(), 100);
      return;
    }

    socket?.emit("send-message", {
      message,
      sender,
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
    <Sheet>
      <div className="flex h-screen bg-black text-white">
        <ChatSidebar />
        <div className="flex flex-col bg-neutral-950 overflow-hidden" style={{ height: viewportHeight }}>
          <div className="p-4 border-b border-neutral-900 flex items-center justify-between bg-neutral-950 shadow-sm z-10">
            {loading ? (
              <HeaderSkeleton />
            ) : (
              <ChatHeader
                receiverImage={receiverImage || ""}
                receiver={receiver || ""}
              />
            )}
          </div>
          <div className="flex-1 overflow-hidden relative">
            <CustomScrollArea className="h-full talko-pattern bg-neutral-900">
              <div className="space-y-4 py-2 pb-2">
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
                      isSender={msg.sender === session?.user.name}
                    />
                  ))
                )}
                {isTyping && typingUser && (
                  <TypingBubble />
                )}
                <div ref={messagesEndRef} />
              </div>
            </CustomScrollArea>
          </div>
          <ChatInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            handleTyping={handleTyping}
            handleKeyDown={handleKeyDown}
          />
        </div>
        <SheetContent className="bg-neutral-950 text-white border-neutral-900 px-2 pr-4">
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <CustomScrollArea className="h-full">
            <ChatSidebar />
          </CustomScrollArea>
          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </div>
    </Sheet>
  );
}
