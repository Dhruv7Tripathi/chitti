"use client"

import { useState } from "react"
import { Search, Edit, Menu } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unreadCount?: number
}

export default function ChatSidebar() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Altman",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hn kro",
      time: "14:29",
    },
    {
      id: "2",
      name: "2G_CSE_2024-2025",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "~Dr.Jaya Sharma: https://urbandiaries...",
      time: "14:24",
    },
    {
      id: "3",
      name: "Section F (Unofficial)",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "~KaranThakur ❤️ 🧗‍♂️ Aajao bhai sab j...",
      time: "14:04",
    },
    {
      id: "4",
      name: "Dev Pratap",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Week 12 Solution.. 1-b 2-c 3-a 4-b 5-b...",
      time: "12:48",
    },
    {
      id: "5",
      name: "Lucifer",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Ok",
      time: "11:33",
    },
    {
      id: "6",
      name: "+91 87084 96994",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Invitation to join my Chat group",
      time: "11:16",
    },
    {
      id: "7",
      name: "2YEAR_CSE_2024-25_G1",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "~DCEA_GLA University: 📚 Hack and...",
      time: "11:11",
    },
    {
      id: "8",
      name: "2F_CSE_2024-2025",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "~Shreesh Shrivastava: 📄 8086 and Peri...",
      time: "11:05",
    },
    {
      id: "9",
      name: "2nd year unofficial group 2.0 (20...",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "~Advik Srivastava: Bhai koi aisa hai... 🔒 3",
      time: "11:02",
      unreadCount: 3,
    },
    {
      id: "10",
      name: "pitashree 2",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "✓ ✓ Image",
      time: "Yesterday",
    },
  ])

  return (
    <div className="w-80 border-r border-gray-800 flex flex-col">
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
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div key={user.id} className="flex items-center p-3 hover:bg-gray-800 cursor-pointer">
            <Avatar className="h-10 w-10 mr-3">
              <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="font-medium truncate">{user.name}</span>
                <span className="text-xs text-gray-400">{user.time}</span>
              </div>
              <p className="text-sm text-gray-400 truncate">{user.lastMessage}</p>
            </div>
            {user.unreadCount && (
              <div className="ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {user.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

