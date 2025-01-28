import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectUser } from "../Slices/userSlice/userSlice";
import { logout } from "../Slices/userSlice/userSlice";
import { useSockets } from "./socketContext";
import { toast } from 'sonner';

export const AuthSocketHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const { userSocket } = useSockets();
  
    useEffect(() => {
      if (userSocket) {
        const handleForceLogout = (data: { message: string }) => {
          console.log("Force logout received:", data);
          
          // Dispatch logout action
          dispatch(logout());
          
          // Show toast notification
          toast.error(data.message, {
            duration: 5000,
            position: 'top-center'
          });
    
          // Redirect to login page
          window.location.href = '/login';
        };
    
        userSocket.on('forceLogout', handleForceLogout);
    
        return () => {
          userSocket.off('forceLogout', handleForceLogout);
        };
      }
    }, [userSocket, user, dispatch]);
    return <>{children}</>;
  };