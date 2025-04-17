

"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus, Settings } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  image: string
  lastMessage?: string
  unreadCount?: number
}

interface ChatSidebarProps {
  onSelectChat?: () => void;
}

export default function ChatSidebar({ onSelectChat }: ChatSidebarProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUsers = async () => {
        setIsLoading(true)
        try {
          const response = await axios.get("/api/users")
          setUsers(response.data)
        } catch (error) {
          console.error("Error fetching users:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchUsers()
    } else if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleChat = (selectedUserId: string) => {
    const currentUserId = session?.user?.id
    if (!currentUserId) {
      router.push("/signin")
    } else {
      const roomId = [currentUserId, selectedUserId].sort().join("$")
      router.push(`/room/${roomId}`)

      if (onSelectChat) {
        onSelectChat();
      }
    }
  }

  const renderUserSkeletons = () => {
    return Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex items-center p-3">
        <Skeleton className="h-10 w-10 rounded-full mr-3" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ));
  }

  const renderContent = () => {
    if (isLoading) {
      return renderUserSkeletons();
    }

    if (filteredUsers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-neutral-400 p-4">
          <div className="mb-2">No conversations found</div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
          >
            <UserPlus size={16} className="mr-2" />
            Start a new chat
          </Button>
        </div>
      )
    }

    return filteredUsers.map((user) => (
      <div
        key={user.id}
        className="flex items-center p-3 hover:bg-neutral-800 rounded-md cursor-pointer transition-colors duration-200"
        onClick={() => handleChat(user.id)}
      >
        <div className="relative">
          <Avatar className="h-12 w-12 mr-3 border border-neutral-700">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-neutral-700 text-neutral-200">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <span className="font-medium truncate">{user.name}</span>
            {(user.unreadCount ?? 0) > 0 && (
              <Badge className="ml-2 bg-blue-600 hover:bg-blue-700">{user.unreadCount ?? 0}</Badge>
            )}
          </div>
          <p className="text-sm text-neutral-400 truncate">
            {user.lastMessage || "Tap to start a conversation"}
          </p>
        </div>
      </div>
    ))
  }

  return (
    <div className="h-full flex flex-col bg-black text-white">
      <div className="p-4 flex justify-between items-center border-b border-neutral-800">
        <h2 className="text-xl font-bold">Chats</h2>
        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
          <Settings size={20} />
        </Button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search conversations"
            className="pl-9 py-2 bg-neutral-800 border-neutral-700 text-neutral-300 focus:ring-neutral-700 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {renderContent()}
      </div>
    </div>
  )
}