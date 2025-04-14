"use client"
import React from 'react'
export default function Room() {
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
  )
}

