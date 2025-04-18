"use client";
import React from 'react';
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Room() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className={`flex ${isMobile ? 'flex-col' : ''} items-center ${isMobile ? 'space-y-3' : 'space-x-4'} p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300`}>
          <svg
            className={`${isMobile ? 'w-12 h-12' : 'w-15 h-15'} text-green-400`}
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
          <span className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-extrabold tracking-wide`}>Chitti</span>
        </div>

        <p className="text-gray-400 text-center max-w-md mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed px-4">
          Use <span className="text-white font-semibold">Chitti</span> to chit chat with your friends and family.
          Send and receive messages without keeping your phone online.
        </p>
      </div>
    </div>
  );
}