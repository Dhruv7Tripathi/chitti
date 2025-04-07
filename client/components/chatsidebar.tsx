"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Menu } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface User {
  id: string
  name: string
  lastMessage: string
  time: string
  unreadCount?: number
  image: string
}

export default function ChatSidebar() {
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
      router.push('/login')
    }
  }, [status, router])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleChatSelect = (userId: string) => {
    router.push(`/chat/${userId}`)
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-40 text-gray-400">Loading users...</div>
    }

    if (filteredUsers.length === 0) {
      return <div className="flex items-center justify-center h-40 text-gray-400">No conversations found</div>
    }

    return filteredUsers.map((user) => (
      <div
        key={user.id}
        className="flex items-center p-3 hover:bg-gray-800 cursor-pointer"
        onClick={() => handleChatSelect(user.id)}
      >
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback className="bg-gray-700">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <span className="font-medium truncate">{user.name}</span>
            <span className="text-xs text-gray-400">{user.time}</span>
          </div>
          <p className="text-sm text-gray-400 truncate">{user.lastMessage}</p>
        </div>
        {user.unreadCount && user.unreadCount > 0 && (
          <div className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {user.unreadCount}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="w-80 border-r border-gray-800 flex flex-col h-full">
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-xl font-bold">Chats</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Edit size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Menu size={20} />
          </Button>
        </div>
      </div>

      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search or start a new chat"
            className="pl-9 bg-gray-800 border-gray-700 text-gray-300 focus:ring-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  )
}