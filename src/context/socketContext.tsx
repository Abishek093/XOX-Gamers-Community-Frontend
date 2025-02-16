// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import Cookies from 'js-cookie'
// import { refreshAccessToken } from "../services/userServices/api"; 
// import { useAppSelector } from "../store/hooks";
// import { selectUser } from "../Slices/userSlice/userSlice";

// interface SocketContextType {
//     userSocket: Socket | null;
//     streamSocket: Socket | null;
//     contentSocket: Socket | null;
//     connectSockets: () => void;
// }

// const SocketContext = createContext<SocketContextType>({
//     userSocket: null,
//     streamSocket: null,
//     contentSocket: null,
//     connectSockets: () => {}
// });

// export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [userSocket, setUserSocket] = useState<Socket | null>(null);
//     const [streamSocket, setStreamSocket] = useState<Socket | null>(null);
//     const [contentSocket, setContentSocket] = useState<Socket | null>(null);

//     const user = useAppSelector(selectUser)

//     const connectSockets = async () => {
//         if (userSocket) userSocket.disconnect();
//         if (streamSocket) streamSocket.disconnect();
//         if (contentSocket) contentSocket.disconnect();

//         let token = Cookies.get('UserAccessToken');

//         console.log("Connecting sockets for user:", user);
//         console.log("User ID:", user?.id);
//         console.log("Access Token:", token);

//         if (!token) {
//             const refreshToken = Cookies.get('UserRefreshToken');
//             if (refreshToken) {
//                 try {
//                     const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);

//                     Cookies.set('UserAccessToken', accessToken, { expires: 1 / 96 }); 
//                     Cookies.set('UserRefreshToken', newRefreshToken, { expires: 7 }); 

//                     token = accessToken;
//                 } catch (error) {
//                     console.error('Failed to refresh token', error);
//                     return;
//                 }
//             } else {
//                 console.error('No refresh token available');
//                 return;
//             }
//         }

//         const userSocketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/socket/user`, {
//             auth: { token },
//             reconnection: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000
//         });

//         userSocketInstance.on('connect', () => {
//             console.log('User socket connected, emitting join_user');
//             userSocketInstance.emit('join_user', user?.id);
//           });

//         const streamSocketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/socket/streaming`, {
//             auth: { token },
//             reconnection: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000
//         });

//         const contentSocketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/socket/content`, {
//             auth: { token },
//             reconnection: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000
//         });


//         const handleSocketError = (socket: Socket, namespace: string) => {
//             socket.on('connect_error', (error) => {
//                 console.error(`${namespace} socket connection error:`, error);
//             });
//             socket.on('disconnect', (reason) => {
//                 console.log(`${namespace} socket disconnected:`, reason);
//             });
//         };

//         handleSocketError(userSocketInstance, 'User');
//         handleSocketError(streamSocketInstance, 'Streaming');
//         handleSocketError(streamSocketInstance, 'Content');

//         setUserSocket(userSocketInstance);
//         setStreamSocket(streamSocketInstance);
//         setContentSocket(contentSocketInstance);

//         console.log("user in socket context: ", user?.id, 'username: ',user?.username, "user socket: ", userSocketInstance)

//     };

//     useEffect(() => {
//         connectSockets(); 

//         return () => {
//             userSocket?.disconnect();
//             streamSocket?.disconnect();
//             contentSocket?.disconnect();
//         };
//     }, []);

//     return (
//         <SocketContext.Provider value={{ userSocket, streamSocket, contentSocket, connectSockets }}>
//             {children}
//         </SocketContext.Provider>
//     );
// };

// export const useSockets = () => {
//     const context = useContext(SocketContext);
//     if (!context) {
//         throw new Error('useSockets must be used within a SocketProvider');
//     }
//     return context;
// };


// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import Cookies from 'js-cookie'
// import { refreshAccessToken } from "../services/userServices/api";
// import { useAppSelector } from "../store/hooks";
// import { selectUser } from "../Slices/userSlice/userSlice";

// interface SocketContextType {
//     userSocket: Socket | null;
//     streamSocket: Socket | null;
//     contentSocket: Socket | null;
//     connectSockets: () => void;
// }

// const SocketContext = createContext<SocketContextType>({
//     userSocket: null,
//     streamSocket: null,
//     contentSocket: null,
//     connectSockets: () => { }
// });

// export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [userSocket, setUserSocket] = useState<Socket | null>(null);
//     const [streamSocket, setStreamSocket] = useState<Socket | null>(null);
//     const [contentSocket, setContentSocket] = useState<Socket | null>(null);

//     const user = useAppSelector(selectUser)

//     const connectSockets = async () => {
//         if (userSocket) userSocket.disconnect();
//         if (streamSocket) streamSocket.disconnect();
//         if (contentSocket) contentSocket.disconnect();

//         let token = Cookies.get('UserAccessToken');

//         if (!token) {
//             const refreshToken = Cookies.get('UserRefreshToken');
//             if (refreshToken) {
//                 try {
//                     const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
//                     token = accessToken;
//                     Cookies.set('UserAccessToken', accessToken, { expires: 1 / 96 });
//                     Cookies.set('UserRefreshToken', newRefreshToken, { expires: 7 });
//                 } catch (error) {
//                     console.error('Failed to refresh token', error);
//                     return;
//                 }
//             } else {
//                 console.error('No refresh token available');
//                 return;
//             }
//         }

//         const socketOptions = {
//             auth: { token },
//             reconnection: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000,
//             transports: ['websocket'],
//             extraHeaders: { 
//                 Authorization: `Bearer ${token}`,
//             },
//             forceNew: true
//         };

//         const baseUrl = import.meta.env.VITE_SOCKET_URL;

//         // Create socket instances with correct namespace paths
//         // const userSocketInstance = io(`${baseUrl}/socket/user`, socketOptions);
//         // const streamSocketInstance = io(`${baseUrl}/socket/streaming`, socketOptions);
//         // const contentSocketInstance = io(`${baseUrl}/socket/content`, socketOptions);
//         const userSocketInstance = io(`${baseUrl}/user`, socketOptions);
//         const streamSocketInstance = io(`${baseUrl}/streaming`, socketOptions);
//         const contentSocketInstance = io(`${baseUrl}/content`, socketOptions);

//         userSocketInstance.on('connect', () => {
//             console.log('User socket connected');
//             if (user?.id) {
//                 userSocketInstance.emit('join_user', user.id);
//             }
//         });

//         // const handleSocketError = (socket: Socket, namespace: string) => {
//         //     socket.on('connect_error', (error) => {
//         //         console.error(`${namespace} socket connection error:`, error);
//         //         // Implement reconnection logic if needed
//         //         setTimeout(() => {
//         //             socket.connect();
//         //         }, 5000);
//         //     });

//         //     socket.on('disconnect', (reason) => {
//         //         console.log(`${namespace} socket disconnected:`, reason);
//         //         if (reason === 'io server disconnect') {
//         //             socket.connect();
//         //         }
//         //     });

//         //     socket.on('error', (error) => {
//         //         console.error(`${namespace} socket error:`, error);
//         //     });
//         // };
//         const handleSocketError = (socket: Socket, namespace: string) => {
//             socket.on('connect_error', (error) => {
//                 console.error(`[${namespace} Socket] Connection error:`, error);
//                 console.error(`[${namespace} Socket] Attempted connection options:`, socket.io.opts);

//                 // Implement reconnection logic if needed
//                 setTimeout(() => {
//                     console.log(`[${namespace} Socket] Retrying connection...`);
//                     socket.connect();
//                 }, 5000);
//             });

//             socket.on('disconnect', (reason) => {
//                 console.warn(`[${namespace} Socket] Disconnected: ${reason}`);
//                 if (reason === 'io server disconnect') {
//                     console.log(`[${namespace} Socket] Trying to reconnect...`);
//                     socket.connect();
//                 }
//             });

//             socket.on('error', (error) => {
//                 console.error(`[${namespace} Socket] Error:`, error);
//             });
//         };


//         handleSocketError(userSocketInstance, 'User');
//         handleSocketError(streamSocketInstance, 'Streaming');
//         handleSocketError(contentSocketInstance, 'Content');

//         setUserSocket(userSocketInstance);
//         setStreamSocket(streamSocketInstance);
//         setContentSocket(contentSocketInstance);
//     };

//     useEffect(() => {
//         connectSockets();

//         return () => {
//             userSocket?.disconnect();
//             streamSocket?.disconnect();
//             contentSocket?.disconnect();
//         };
//     }, []);

//     return (
//         <SocketContext.Provider value={{ userSocket, streamSocket, contentSocket, connectSockets }}>
//             {children}
//         </SocketContext.Provider>
//     );
// };

// export const useSockets = () => {
//     const context = useContext(SocketContext);
//     if (!context) {
//         throw new Error('useSockets must be used within a SocketProvider');
//     }
//     return context;
// };


    // const connectSockets = async () => {
    //     if (userSocket) userSocket.disconnect();
    //     if (streamSocket) streamSocket.disconnect();
    //     if (contentSocket) contentSocket.disconnect();

    //     let token = Cookies.get('UserAccessToken');

    //     if (!token) {
    //         const refreshToken = Cookies.get('UserRefreshToken');
    //         if (refreshToken) {
    //             try {
    //                 const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
    //                 token = accessToken;
    //                 Cookies.set('UserAccessToken', accessToken, { expires: 1 / 96 });
    //                 Cookies.set('UserRefreshToken', newRefreshToken, { expires: 7 });
    //             } catch (error) {
    //                 console.error('Failed to refresh token', error);
    //                 return;
    //             }
    //         } else {
    //             console.error('No refresh token available');
    //             return;
    //         }
    //     }

    //     // const socketOptions = {
    //     //     auth: {
    //     //         token: `Bearer ${token}`
    //     //     },
    //     //     path: '/socket.io/',
    //     //     transportOptions: {
    //     //         polling: {
    //     //             extraHeaders: {
    //     //                 Authorization: `Bearer ${token}`
    //     //             }
    //     //         }
    //     //     },
    //     //     reconnection: true,
    //     //     reconnectionAttempts: 5,
    //     //     reconnectionDelay: 1000,
    //     //     transports: ['polling', 'websocket'],
    //     //     timeout: 20000,
    //     //     forceNew: true
    //     // };
    //     const socketOptions = {
    //         auth: {
    //             token: `Bearer ${token}`
    //         },
    //         path: '/socket.io/',
    //         transportOptions: {
    //             polling: {
    //                 extraHeaders: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             }
    //         },
    //         reconnection: true,
    //         reconnectionAttempts: 5,
    //         reconnectionDelay: 1000,
    //         transports: ['websocket'],
    //         timeout: 20000,
    //         forceNew: true
    //     };

    //     const baseUrl = import.meta.env.VITE_SOCKET_URL;

    //     // Create socket instances with namespace paths
    //     const userSocketInstance = io(`${baseUrl}/socket/user`, socketOptions);
    //     const streamSocketInstance = io(`${baseUrl}/socket/streaming`, socketOptions);
    //     const contentSocketInstance = io(`${baseUrl}/socket/content`, socketOptions);

    //     // Enhanced error handling and debugging
    //     const setupSocketHandlers = (socket: Socket, namespace: string) => {
    //         socket.on('connect', () => {
    //             console.log(`[${namespace}] Socket connected successfully`);
    //             console.log(`[${namespace}] Transport:`, socket.io.engine.transport.name);
                
    //             if (namespace === 'User' && user?.id) {
    //                 socket.emit('join_user', user.id);
    //                 console.log(`[${namespace}] Joined user room:`, user.id);
    //             }
    //         });

    //         socket.io.engine.on('upgrade', () => {
    //             console.log(`[${namespace}] Transport upgraded to:`, socket.io.engine.transport.name);
    //         });

    //         socket.on('connect_error', (error) => {
    //             console.error(`[${namespace}] Connection error:`, error);
    //             console.log(`[${namespace}] Current transport:`, socket.io.engine.transport.name);
    //             console.log(`[${namespace}] Connection state:`, socket.connected);
    //             console.log(`[${namespace}] Auth token:`, socketOptions.auth.token);
    //         });

    //         socket.on('error', (error) => {
    //             console.error(`[${namespace}] Socket error:`, error);
    //         });

    //         socket.on('disconnect', (reason) => {
    //             console.log(`[${namespace}] Disconnected:`, reason);
    //             if (reason === 'io server disconnect') {
    //                 console.log(`[${namespace}] Attempting reconnection...`);
    //                 socket.connect();
    //             }
    //         });
    //     };

    //     setupSocketHandlers(userSocketInstance, 'User');
    //     setupSocketHandlers(streamSocketInstance, 'Streaming');
    //     setupSocketHandlers(contentSocketInstance, 'Content');

    //     setUserSocket(userSocketInstance);
    //     setStreamSocket(streamSocketInstance);
    //     setContentSocket(contentSocketInstance);
    // };


    

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from 'js-cookie';
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../Slices/userSlice/userSlice";
import { refreshAccessToken } from "../services/userServices/api";

interface SocketContextType {
    userSocket: Socket | null;
    streamSocket: Socket | null;
    contentSocket: Socket | null;
    connectSockets: () => void;
}

const SocketContext = createContext<SocketContextType>({
    userSocket: null,
    streamSocket: null,
    contentSocket: null,
    connectSockets: () => { }
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userSocket, setUserSocket] = useState<Socket | null>(null);
    const [streamSocket, setStreamSocket] = useState<Socket | null>(null);
    const [contentSocket, setContentSocket] = useState<Socket | null>(null);

    const user = useAppSelector(selectUser);



    const connectSockets = async () => {
        if (userSocket) userSocket.disconnect();
        if (streamSocket) streamSocket.disconnect();
        if (contentSocket) contentSocket.disconnect();
    
        let token = Cookies.get('UserAccessToken');
    
        if (!token) {
            const refreshToken = Cookies.get('UserRefreshToken');
            if (refreshToken) {
                try {
                    const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
                    token = accessToken;
                    Cookies.set('UserAccessToken', accessToken, { expires: 1 / 96 });
                    Cookies.set('UserRefreshToken', newRefreshToken, { expires: 7 });
                } catch (error) {
                    console.error('Failed to refresh token', error);
                    return;
                }
            } else {
                console.error('No refresh token available');
                return;
            }
        }
    
        const socketOptions = {
            auth: {
                token: `Bearer ${token}`
            },
            path: '/socket.io/',
            transportOptions: {
                polling: {
                    extraHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                }
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ['websocket'],
            timeout: 20000,
            forceNew: true
        };
    
        const baseUrl = import.meta.env.VITE_SOCKET_URL;
    
        const userSocketUrl = `${baseUrl}/user`;
        const streamSocketUrl = `${baseUrl}/streaming`;
        const contentSocketUrl = `${baseUrl}/content`;
    
        console.log(`[Connecting] User Socket: ${userSocketUrl}`);
        console.log(`[Connecting] Streaming Socket: ${streamSocketUrl}`);
        console.log(`[Connecting] Content Socket: ${contentSocketUrl}`);
    
        const userSocketInstance = io(userSocketUrl, socketOptions);
        const streamSocketInstance = io(streamSocketUrl, socketOptions);
        const contentSocketInstance = io(contentSocketUrl, socketOptions);
    
        const setupSocketHandlers = (socket: Socket, namespace: string, url: string) => {
            socket.on('connect', () => {
                console.log(`[${namespace}] Connected to ${url}`);
                console.log(`[${namespace}] Transport:`, socket.io.engine.transport.name);
                
                if (namespace === 'User' && user?.id) {
                    socket.emit('join_user', user.id);
                    console.log(`[${namespace}] Joined user room:`, user.id);
                }
            });
    
            socket.on('connect_error', (error) => {
                console.error(`[${namespace}] Connection error:`, error);
                console.log(`[${namespace}] Current transport:`, socket.io.engine.transport.name);
                console.log(`[${namespace}] Connection state:`, socket.connected);
                console.log(`[${namespace}] Auth token:`, socketOptions.auth.token);
                console.log(`[${namespace}] Attempted URL: ${url}`);
            });
    
            socket.on('disconnect', (reason) => {
                console.log(`[${namespace}] Disconnected:`, reason);
                if (reason === 'io server disconnect') {
                    console.log(`[${namespace}] Attempting reconnection...`);
                    socket.connect();
                }
            });
        };
    
        setupSocketHandlers(userSocketInstance, 'User', userSocketUrl);
        setupSocketHandlers(streamSocketInstance, 'Streaming', streamSocketUrl);
        setupSocketHandlers(contentSocketInstance, 'Content', contentSocketUrl);
    
        setUserSocket(userSocketInstance);
        setStreamSocket(streamSocketInstance);
        setContentSocket(contentSocketInstance);
    };
    

    useEffect(() => {
        connectSockets();

        return () => {
            userSocket?.disconnect();
            streamSocket?.disconnect();
            contentSocket?.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ userSocket, streamSocket, contentSocket, connectSockets }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSockets = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSockets must be used within a SocketProvider');
    }
    return context;
};