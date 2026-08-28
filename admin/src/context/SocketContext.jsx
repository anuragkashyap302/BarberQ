import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Global WebSocket context banaya hai taaki admin/barber me sockets reuse ho sake
export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  // AppContext ya env variable se backend URL load kiya
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    // Sockets connect connection init kiya backend server ke sath
    const socketInstance = io(backendURL, {
      autoConnect: true,
      transports: ["websocket", "polling"]
    });

    setSocket(socketInstance);

    // Cleanup trigger block: React component destroy/unmount hone par connection disconnect close karega
    return () => {
      socketInstance.disconnect();
    };
  }, [backendURL]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
