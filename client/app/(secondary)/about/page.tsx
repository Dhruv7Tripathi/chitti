'use client';

import { Github, Twitter, Linkedin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-white py-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* You can replace this div with a real image later */}
          <div className="relative h-[400px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-700">
            <svg
              className="w-32 h-32 text-white"
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
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Our Story</h2>
            <p>
              Chitti is a modern, lightweight chatting application designed to make conversations faster, smarter, and more personal. Built with real-time technology, Chitti allows users to send instant messages, create chat rooms, share media, and stay connected with friends, family, or teams — all with a clean, intuitive interface.
            </p>
          </div>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">Connect With Us</h2>
          <div className="flex justify-center gap-6">
            <a
              href="https://twitter.com/dhruvtripathi77"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://github.com/Dhruv7Tripathi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/dhruv-tripathi-9848792aa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
