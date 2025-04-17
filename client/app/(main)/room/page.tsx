"use client";
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from "@/hooks/useMediaQuery";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  image: string;
  email: string;
  lastMessage?: string;
  unreadCount?: number;
}

interface ChatSidebarProps {
  onSelectChat?: () => void;
}

export default function Room({ onSelectChat }: ChatSidebarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUsers = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get("/api/users");
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUsers();
    } else if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChat = (selectedUserId: string) => {
    const currentUserId = session?.user?.id;
    if (!currentUserId) {
      router.push("/signin");
    } else {
      const roomId = [currentUserId, selectedUserId].sort().join("$");
      router.push(`/room/${roomId}`);

      if (onSelectChat) {
        onSelectChat();
      }
    }
  };

  if (isMobile) {
    return (
      <div className="h-screen bg-black text-white">
        <div className="w-full h-full flex flex-col p-4">
          <div className="flex items-center justify-center space-x-2 p-4 bg-gray-800 rounded-lg mb-4">
            <svg
              className="w-6 h-6 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-2xl font-bold">Chitti</span>
          </div>

          {/* Search box */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="text-gray-400 text-sm mb-2 px-2">Recent Chats</div>
            {isLoading ? (
              <div className="text-center py-4 text-gray-400">Loading...</div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer"
                  onClick={() => handleChat(user.id)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white">{user.name}</div>
                    <div className="text-gray-400 text-xs">
                      {user.lastMessage || "Start chatting"}
                    </div>
                  </div>
                  {user.unreadCount && user.unreadCount > 0 && (
                    <div className="bg-green-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {user.unreadCount}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">No users found</div>
            )}
          </div>

          <div className="flex justify-around pt-2 border-t border-gray-800">
            <button className="p-2 text-green-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex items-center space-x-4 p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
          <svg
            className="w-15 h-15 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-5xl font-extrabold tracking-wide">Chitti</span>
        </div>

        <p className="text-gray-400 text-center max-w-md mt-6 leading-relaxed">
          Use <span className="text-white font-semibold">Chitti</span> to chit chat with your friends and family.
          Send and receive messages without keeping your phone online.
        </p>
      </div>
    </div>
  );
}