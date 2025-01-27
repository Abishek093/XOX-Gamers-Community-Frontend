import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from 'js-cookie'
import { refreshAccessToken } from "../services/userServices/api"; 
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../Slices/userSlice/userSlice";

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
    connectSockets: () => {}
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userSocket, setUserSocket] = useState<Socket | null>(null);
    const [streamSocket, setStreamSocket] = useState<Socket | null>(null);
    const [contentSocket, setContentSocket] = useState<Socket | null>(null);

    const user = useAppSelector(selectUser)
    
    const connectSockets = async () => {
        if (userSocket) userSocket.disconnect();
        if (streamSocket) streamSocket.disconnect();
        if (contentSocket) contentSocket.disconnect();

        let token = Cookies.get('UserAccessToken');
        
        console.log("Connecting sockets for user:", user);
        console.log("User ID:", user?.id);
        console.log("Access Token:", token);

        if (!token) {
            const refreshToken = Cookies.get('UserRefreshToken');
            if (refreshToken) {
                try {
                    const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
                    
                    Cookies.set('UserAccessToken', accessToken, { expires: 1 / 96 }); 
                    Cookies.set('UserRefreshToken', newRefreshToken, { expires: 7 }); 
                    
                    token = accessToken;
                } catch (error) {
                    console.error('Failed to refresh token', error);
                    return;
                }
            } else {
                console.error('No refresh token available');
                return;
            }
        }

        const userSocketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/user`, {
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        userSocketInstance.on('connect', () => {
            console.log('User socket connected, emitting join_user');
            userSocketInstance.emit('join_user', user?.id);
          });

        const streamSocketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/streaming`, {
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        const contentSocketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/content`, {
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });


        const handleSocketError = (socket: Socket, namespace: string) => {
            socket.on('connect_error', (error) => {
                console.error(`${namespace} socket connection error:`, error);
            });
            socket.on('disconnect', (reason) => {
                console.log(`${namespace} socket disconnected:`, reason);
            });
        };

        handleSocketError(userSocketInstance, 'User');
        handleSocketError(streamSocketInstance, 'Streaming');
        handleSocketError(streamSocketInstance, 'Content');

        setUserSocket(userSocketInstance);
        setStreamSocket(streamSocketInstance);
        setContentSocket(contentSocketInstance);

        console.log("user in socket context: ", user?.id, 'username: ',user?.username, "user socket: ", userSocketInstance)

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