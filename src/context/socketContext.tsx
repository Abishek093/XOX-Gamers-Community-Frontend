// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = 'http://localhost:3000';

// const SocketContext = createContext<Socket | null>(null);

// export const useSocket = () => {
//     return useContext(SocketContext);
// };

// export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [socket, setSocket] = useState<Socket | null>(null);

//     useEffect(() => {
//         const newSocket = io(SOCKET_URL);
//         setSocket(newSocket);

//         return () => {
//             newSocket.close();
//         };
//     }, []);

//     return (
//         <SocketContext.Provider value={socket}>
//             {children}
//         </SocketContext.Provider>
//     );
// };
