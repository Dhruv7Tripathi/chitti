"use client"

// import React from 'react'
// import LandingPage from '@/components/landingpage'
// const Home = () => {
//   return (
//     <div>
//       <LandingPage />
//     </div>
//   )
// }

// export default Home

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';

export default function Home() {
  const { auth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (auth.isAuthenticated) {
        router.push('/rooms');
      } else {
        router.push('/login');
      }
    }
  }, [auth.isAuthenticated, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Chat Application</h1>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
