"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import SignInButton from './SignInButton';
import UserAccountNav from './UserAccountNav';

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white">
      <nav className="relative z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xl font-bold text-white">Chitti</span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-4">
            <a href="#features" className="hover:text-indigo-200 transition text-sm">Features</a>
            <a href="#about" className="hover:text-indigo-200 transition text-sm">About</a>
          </div>

          <div className="flex items-center">
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <SignInButton text="Sign In" />
            )}
          </div>
        </div>
      </nav>

      <div className="relative z-10 px-6 pt-20 pb-32 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Connect with others in real-time chat rooms
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Seamless, fast, and beautifully designed conversation spaces for teams, friends, and communities.
            </p>

            <div className="max-w-md">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-full mb-8">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="start chatting with your friends..."
                    className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-white/60"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Link
                    href={username ? `/chat?username=${encodeURIComponent(username)}` : "/room"}
                    className="bg-white text-emerald-600 px-6 py-3 rounded-full font-medium hover:bg-white transition"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isHovered ? "Let's Go! →" : "Start Chatting"}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-3xl transform rotate-3 blur-lg opacity-30"></div>
            <div className="relative bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="px-3 py-1 bg-gray-500 rounded-full text-sm">
                  Tech Room
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="max-w-xs bg-emerald-500 p-3 rounded-lg rounded-tl-none">
                  <div className="text-xs mb-1 font-semibold">yuvraj</div>
                  <div>Has anyone tried the new React 18 features yet?</div>
                </div>

                <div className="max-w-xs ml-auto bg-white/10 p-3 rounded-lg rounded-tr-none">
                  <div className="text-xs mb-1 font-semibold">Dhruv</div>
                  <div>Yes! The new concurrent rendering is amazing!</div>
                </div>

                <div className="max-w-xs bg-emerald-500 p-3 rounded-lg rounded-tl-none">
                  <div className="text-xs mb-1 font-semibold">yuvraj</div>
                  <div>I&apos;m still learning it. Any good resources?</div>
                </div>

                <div className="max-w-xs ml-auto bg-white/10 p-3 rounded-lg rounded-tr-none animate-pulse">
                  <div className="text-xs mb-1 font-semibold">Dhruv</div>
                  <div>Sure, I can share some links...</div>
                </div>
              </div>

              <div className="flex rounded-full overflow-hidden bg-white/10 border border-white/10">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-4 py-3 outline-none"
                />
                <button className="bg-emerald-500 px-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="relative z-10 from-black via-gray-800 to-black py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose ConnectChat?</h2>
            <p className="max-w-xl mx-auto text-indigo-200">Our platform offers the best chat experience with cutting-edge features and a beautiful interface.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Real-time Messaging",
                description: "Messages are delivered instantly with our optimized WebSocket implementation."
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Multiple Chat Rooms",
                description: "Join different rooms based on your interests or create private ones for your team."
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Secure Communication",
                description: "End-to-end encryption ensures your conversations remain private and secure."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition">
                <div className="text-indigo-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-indigo-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-10 from-black via-gray-800 to-black py-6 ">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <svg className="w-8 h-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xl font-bold">Chitti</span>
            </div>
            <div className="text-indigo-300 text-sm">
              © 2025 Chitti, founder:-@dhruvtripathi.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}