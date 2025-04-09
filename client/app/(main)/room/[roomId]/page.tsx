'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useSocket from '@/hooks/useSocket'
import { useSession } from 'next-auth/react'
import ChatSidebar from '@/components/chatsidebar'
import axios from 'axios'
import useRequireAuth from '@/hooks/useRequireAuth'
interface Message {
  sender: string
  text: string
  createdAt: string
}

interface User {
  id: string
  name: string
  image: string
}

const ChatRoom = () => {
  const params = useParams()
  const router = useRouter()
  useRequireAuth();

  const roomId = typeof params.roomId === 'string' ? params.roomId : Array.isArray(params.roomId) ? params.roomId[0] : ''
  const userId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const { data: session } = useSession()
  const socket = useSocket(userId)

  const senderId = session?.user?.id
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`)
        setUser(res.data)
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/signin')
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, router])

  useEffect(() => {
    if (socket && roomId && session?.user?.name) {
      socket.emit("join-room", { roomId })

      const handleMessage = ({ sender, message, createdAt }: any) => {
        setMessages(prev => [...prev, { sender, text: message, createdAt }])
      }

      socket.on("receive-message", handleMessage)
      socket.on("chat-cleared", () => setMessages([]))

      return () => {
        socket.off("receive-message", handleMessage)
        socket.off("chat-cleared")
      }
    }
  }, [socket, roomId, session?.user?.name])

  useEffect(() => {
    if (socket) {
      socket.on("connected", () => {
        console.log("Socket connection established")
      })

      return () => {
        socket.off("connected")
      }
    }
  }, [socket])

  const sendMessage = () => {
    if (!input.trim() || !socket || !senderId || !userId || !session?.user.name) return

    const newMessage = {
      message: input.trim(),
      roomId,
      sender: session.user.name,
    }

    socket.emit("sendmessage", newMessage)

    setMessages(prev => [
      ...prev,
      {
        sender: 'You',
        text: input.trim(),
        createdAt: new Date().toISOString(),
      }
    ])

    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <ChatSidebar />

      <div className="flex flex-col flex-1">
        <div className="flex items-center space-x-4 px-6 py-4 bg-gray-900 shadow">
          {user?.image ? (
            <img src={user.image} alt={user.name || 'User'} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700" />
          )}
          <div className="text-xl font-semibold">{user?.name || 'User'}</div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs p-3 rounded-lg ${msg.sender === 'You' ? 'bg-green-600 self-end text-right' : 'bg-gray-700 self-start text-left'
                }`}
            >
              <p className="text-sm font-bold">{msg.sender}</p>
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-800 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            type="button"
            onClick={sendMessage}
            className="bg-black px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom
