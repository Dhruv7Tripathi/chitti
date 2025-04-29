"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import SignInButton from '../auth/SignInButton';
import UserAccountNav from '../auth/UserAccountNav';

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session } = useSession();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white">
      <nav className="relative z-20 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-lg sm:text-xl font-bold text-white">Chitti</span>
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-4">
            {/* <a href="#features" className="hover:text-indigo-200 transition text-sm">Features</a> */}
            <a href="/about" className="hover:text-indigo-200 transition text-sm">About</a>
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

      {menuOpen && (
        <div className="md:hidden absolute z-10 top-16 inset-x-0 bg-gray-800/95 backdrop-blur-md py-4 px-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="hover:text-indigo-200 transition text-sm" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#about" className="hover:text-indigo-200 transition text-sm" onClick={() => setMenuOpen(false)}>About</a>
            <div className="pt-2">
              {session?.user ? (
                <UserAccountNav user={session.user} />
              ) : (
                <SignInButton text="Sign In" />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-1 px-4 sm:px-6 pt-8 sm:pt-20 pb-16 sm:pb-32 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6">
              Connect with others in real-time chat rooms
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 mb-6 sm:mb-8">
              Seamless, fast, and beautifully designed conversation spaces for teams, friends, and communities.
            </p>

            <div className="w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-full mb-8">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0">
                  <input
                    type="text"
                    placeholder="start chatting with your friends..."
                    className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-white/60 rounded-full sm:rounded-none sm:rounded-l-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Link
                    href={username ? `/chat?username=${encodeURIComponent(username)}` : "/room"}
                    className="bg-white text-emerald-600 px-6 py-3 rounded-full font-medium hover:bg-white transition text-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isHovered ? "Let's Go! →" : "Start Chatting"}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-6 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-3xl transform rotate-3 blur-lg opacity-30"></div>
            <div className="relative bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-3xl border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="px-2 sm:px-3 py-1 bg-green-700 rounded-full text-xs sm:text-sm">
                  Tech Room
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="max-w-xs bg-white/10  p-2 sm:p-3 rounded-lg rounded-tl-none text-sm">
                  <div className="text-xs mb-1 font-semibold">yuvraj</div>
                  <div>Has anyone tried the new React 18 features yet?</div>
                </div>

                <div className="max-w-xs ml-auto bg-emerald-500 p-2 sm:p-3 rounded-lg rounded-tr-none text-sm">
                  <div className="text-xs mb-1 font-semibold">Dhruv</div>
                  <div>Yes! The new concurrent rendering is amazing!</div>
                </div>

                <div className="max-w-xs bg-white/10  p-2 sm:p-3 rounded-lg rounded-tl-none text-sm">
                  <div className="text-xs mb-1 font-semibold">yuvraj</div>
                  <div>I&apos;m still learning it. Any good resources?</div>
                </div>

                <div className="max-w-xs ml-auto bg-emerald-500 p-2 sm:p-3 rounded-lg rounded-tr-none text-sm">
                  <div className="text-xs mb-1 font-semibold">Dhruv</div>
                  <div>Sure, I can share some links...</div>
                </div>
              </div>

              <div className="flex rounded-full overflow-hidden bg-white/10 border border-white/10">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-3 sm:px-4 py-2 sm:py-3 outline-none text-sm"
                />
                <button className="bg-emerald-500 px-3 sm:px-4">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="relative z-10 from-black via-gray-800 to-black py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose Chitti?</h2>
            <p className="max-w-xl mx-auto text-indigo-200 text-sm sm:text-base">Our platform offers the best chat experience with cutting-edge features and a beautiful interface.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Real-time Messaging",
                description: "Messages are delivered instantly with our optimized WebSocket implementation."
              },
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Multiple Chat Rooms",
                description: "Join different rooms based on your interests or create private ones for your team."
              },
              {
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Minimalistic and Fast UI:",
                description: "Focus on conversations without any clutter."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10 hover:bg-white/10 transition">
                <div className="text-indigo-400 mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-indigo-200 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-10 from-black via-gray-800 to-black py-4 sm:py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-lg sm:text-xl font-bold">Chitti</span>
            </div>
            <div className="text-indigo-300 text-xs sm:text-sm">
              © 2025 Chitti, founder:-@dhruvtripathi.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}