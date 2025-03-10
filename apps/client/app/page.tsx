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
import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/auth';
import { SocketProvider } from '../context/socketContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SocketProvider>
        <Component {...pageProps} />
      </SocketProvider>
    </AuthProvider>
  );
}

export default MyApp;
