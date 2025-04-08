// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import useSocket from '@/hooks/useSocket'
// import { useSession } from 'next-auth/react'
// import axios from 'axios'
// interface Message {
//   id?: string
//   content: string
//   senderId: string
//   receiverId: string
//   createdAt?: string
// }

// const ChatRoom = () => {
//   const { id: receiverId } = useParams()
//   const { data: session } = useSession()
//   const socket = useSocket(receiverId as string)
//   const { roomId } = useParams()
//   const [messages, setMessages] = useState<Message[]>([])
//   const [input, setInput] = useState('')
//   const senderId = session?.user?.id


//   useEffect(() => {
//     const [id1, id2] = decodeURIComponent(
//       Array.isArray(roomId) ? roomId.join("") : roomId ?? ""
//     ).split("$");
//   }, []);


//   useEffect(() => {
//     if (socket && senderId && receiverId) {
//       socket.emit('joinRoom', { roomId: receiverId })

//       socket.on('message', (msg: Message) => {
//         setMessages(prev => [...prev, msg])
//       })

//       return () => {
//         socket.off('message')
//       }
//     }
//   }, [socket, senderId, receiverId])

//   const sendMessage = () => {
//     if (!input.trim() || !socket || !senderId) return

//     const msg: Message = {
//       content: input,
//       senderId,
//       receiverId: receiverId as string,
//     }

//     socket.emit('sendMessage', msg)
//     setMessages(prev => [...prev, msg])
//     setInput('')
//   }

//   return (
//     <div className="flex flex-col h-screen p-4 bg-black text-white">
//       <div className="flex-1 overflow-y-auto space-y-2 mb-4">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`max-w-xs p-2 rounded-lg ${msg.senderId === senderId
//                 ? 'bg-green-600 self-end ml-auto'
//                 : 'bg-gray-700'
//               }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//       </div>

//       <div className="flex items-center space-x-2">
//         <input
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           className="flex-1 p-2 rounded bg-gray-800 border border-gray-600"
//           placeholder="Type your message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 px-4 py-2 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   )
// }

// export default ChatRoom
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import useSocket from '@/hooks/useSocket'
import { useSession } from 'next-auth/react'

interface Message {
  content: string
  senderId: string
  receiverId: string
  createdAt?: string
}

interface User {
  id: string
  name: string
  image: string
}

const ChatRoom = () => {
  const { id: receiverId } = useParams()
  const { data: session } = useSession()
  const socket = useSocket(receiverId as string)

  const senderId = session?.user?.id
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [receiver, setReceiver] = useState<User | null>(null)

  // Fetch receiver data
  useEffect(() => {
    const getReceiver = async () => {
      try {
        const res = await fetch(`/api/user/${receiverId}`)
        if (res.ok) {
          const data = await res.json()
          setReceiver(data)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    if (receiverId) getReceiver()
  }, [receiverId])

  // Socket setup
  useEffect(() => {
    if (socket && senderId && receiverId) {
      socket.emit('joinRoom', { roomId: receiverId })

      socket.on('message', (msg: Message) => {
        setMessages(prev => [...prev, msg])
      })

      return () => {
        socket.off('message')
      }
    }
  }, [socket, senderId, receiverId])

  const sendMessage = () => {
    if (!input.trim() || !socket || !senderId || !receiverId) return

    const msg: Message = {
      content: input,
      senderId,
      receiverId: receiverId as string,
    }

    socket.emit('sendMessage', msg)
    setMessages(prev => [...prev, msg])
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex items-center space-x-4 px-6 py-4 bg-gray-900 shadow">
        {receiver?.image ? (
          <img
            src={receiver.image}
            alt={receiver.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700" />
        )}
        <div className="text-xl font-semibold">{receiver?.name || 'User'}</div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 rounded-lg ${msg.senderId === senderId
                ? 'bg-green-600 self-end ml-auto text-right'
                : 'bg-gray-700 text-left'
              }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-800 flex items-center space-x-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatRoom
