import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Guard against connection attempts when not authenticated or no token
    if (!auth.isAuthenticated || !auth.token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Log auth state for debugging
    console.log('Auth state during socket init:', {
      isAuthenticated: auth.isAuthenticated,
      tokenExists: !!auth.token,
      tokenValue: auth.token
    });

    // Log the API URL to ensure it's correctly set
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    console.log('Connecting to API URL:', apiUrl);

    // Implement the socket connection
    console.log('Using websocket token:', auth.token);
    const newSocket = io(apiUrl, {
      auth: { token: auth.token }, // ✅ Send token in handshake
      transports: ["websocket"],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected, reason:', reason);
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, [auth.isAuthenticated, auth.token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};