// import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { useSelector } from "react-redux";
// import io from "socket.io-client";
// import { selectUser } from "../../Slices/userSlice/userSlice";
// import { setupSocketOneEvents } from "./socketOneHandlers";  // Import handler for socket one
// import { setupSocketTwoEvents } from "./socketTwoHandlers";  // Import handler for socket two

// interface SocketContextType {
//   socket: ReturnType<typeof io> | null;
//   socketServiceTwo: ReturnType<typeof io> | null;
//   followRequests: { userId: string; followerId: string }[];
// }

// const socketContext = createContext<SocketContextType | undefined>(undefined);

// interface SocketProviderProps {
//   children: ReactNode;
// }

// function SocketProvider({ children }: SocketProviderProps) {
//   const ownUser = useSelector(selectUser);
//   const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
//   const [socketServiceTwo, setSocketServiceTwo] = useState<ReturnType<typeof io> | null>(null);
//   const [followRequests, setFollowRequests] = useState<{ userId: string; followerId: string }[]>([]);

//   useEffect(() => {
//     // If ownUser is null or does not have a valid id, skip socket initialization
//     if (!ownUser || !ownUser.id) {
//       console.log("ownUser is not available or does not have a valid ID, skipping socket initialization.");
//       return;
//     }

//     const newSocketOne = io("http://localhost:5001");
//     const newSocketTwo = io("http://localhost:3000");

//     setSocket(newSocketOne);
//     setSocketServiceTwo(newSocketTwo);

//     // Set up event handlers for both sockets
//     const cleanupSocketOne = setupSocketOneEvents(newSocketOne);
//     const cleanupSocketTwo = setupSocketTwoEvents(newSocketTwo, { id: ownUser.id }, setFollowRequests); // Pass as an object

//     return () => {
//       newSocketOne.disconnect();
//       newSocketTwo.disconnect();
//       cleanupSocketOne();  // Cleanup socket one events
//       cleanupSocketTwo();  // Cleanup socket two events
//       console.log("Sockets disconnected and cleaned up");
//     };
//   }, [ownUser]);  // Add ownUser as a dependency

//   return (
//     <socketContext.Provider value={{ socket, socketServiceTwo, followRequests }}>
//       {children}
//     </socketContext.Provider>
//   );
// }

// export default SocketProvider;

// export const useSocket = () => {
//   const context = useContext(socketContext);
//   if (!context) {
//     throw new Error("useSocket must be used within a SocketProvider");
//   }
//   return context;
// };
