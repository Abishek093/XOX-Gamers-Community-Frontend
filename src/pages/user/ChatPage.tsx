// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Typography} from "@mui/material";
// import ChatList from "../../components/User/ChagPage/ChatList";
// import ChatBody from "../../components/User/ChagPage/ChatBody";
// import ChatFooter from "../../components/User/ChagPage/ChatFooter";
// import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
// import ChatHeader from "../../components/User/ChagPage/ChatHeader";
// import { useAppSelector } from "../../store/hooks";
// import { selectUser } from "../../Slices/userSlice/userSlice";
// import { IChatConversation, IMessage } from "../../interfaces/userInterfaces/apiInterfaces";
// import { toast } from "sonner";
// import axiosInstance from "../../../src/services/userServices/axiosInstance";
// import { getPresignedUrl, uploadImageToS3 } from "../../Utils/imageUploadHelper";
// import { useSockets } from "../../context/socketContext";
// import debounce from "lodash.debounce";

// const ChatPage: React.FC = () => {
//   const ownUser = useAppSelector(selectUser);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { userSocket } = useSockets();
//   const socketConnectedRef = useRef<boolean>(false);
//   const currentRoomRef = useRef<string | null>(null);
//   const documentVisibleRef = useRef<boolean>(true);

//   const [selectedChat, setSelectedChat] = useState<IChatConversation | null>(null);
//   const [message, setMessage] = useState<string>("");
//   const [conversations, setConversations] = useState<IChatConversation[]>([]);
//   const [attachment, setAttachment] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
//   const [messagesByChat, setMessagesByChat] = useState<{ [chatId: string]: IMessage[] }>({});
//   const API_URL = import.meta.env.VITE_STREAMING_SERVICE_API_URL;
//   const unseenMessagesRef = useRef<Set<string>>(new Set());



//   const handleNewMessage = useCallback(
//     (msg: IMessage, isLocal: boolean = false) => {
//       if (!msg.chatId || !msg.sender._id) return;

//       setMessagesByChat(prev => {
//         const chatMessages = [...(prev[msg.chatId] || [])];

//         console.log("hello!", chatMessages.findIndex(existingMsg =>
//           (existingMsg._id?.startsWith('temp-') &&
//             existingMsg.sender._id === msg.sender._id &&
//             existingMsg.content === msg.content &&
//             existingMsg.chatId === msg.chatId) ||
//           existingMsg._id === msg._id
//         ))
//         if (isLocal) {
//           chatMessages.push(msg);
//         } else {
//           const tempMessageIndex = chatMessages.findIndex(existingMsg =>
//             (existingMsg._id?.startsWith('temp-') &&
//               existingMsg.sender._id === msg.sender._id &&
//               existingMsg.content === msg.content &&
//               existingMsg.chatId === msg.chatId) ||
//             existingMsg._id === msg._id
//           );

//           if (tempMessageIndex !== -1) {
//             // Replace temp message with server message
//             chatMessages[tempMessageIndex] = msg;
//           } else {
//             // Add new message if not replacing a temp one
//             chatMessages.push(msg);
//           }
//         }

//         // Update conversations list
//         setConversations(prevConvs => {
//           const chatIndex = prevConvs.findIndex(c => c._id === msg.chatId);
//           if (chatIndex === -1) return prevConvs;

//           const updatedChat = {
//             ...prevConvs[chatIndex],
//             lastMessage: msg,
//             updatedAt: new Date().toISOString()
//           };

//           const newConvs = [...prevConvs];
//           newConvs.splice(chatIndex, 1);
//           return [updatedChat, ...newConvs];
//         });

//         return {
//           ...prev,
//           [msg.chatId]: chatMessages
//         };
//       });
//     },
//     [ownUser?.id]
//   );


//   useEffect(() => {
//     if (!userSocket) return;

//     const handleUnreadCountUpdate = (data: { chatId: string; count: number }) => {
//       setUnreadCounts(prev => ({
//         ...prev,
//         [data.chatId]: data.count
//       }));
//     };

//     const handleNewMessage = (newMessage: IMessage) => {
//       if (selectedChat?._id === newMessage.chatId && documentVisibleRef.current) {
//         userSocket.emit('messageSeen', {
//           userID: ownUser?.id,
//           chatID: newMessage.chatId,
//           messageIds: [newMessage._id!]
//         });
//       } 
//       else if (newMessage.sender._id !== ownUser?.id) {
//         setUnreadCounts(prev => ({
//           ...prev,
//           [newMessage.chatId]: (prev[newMessage.chatId] || 0) + 1
//         }));
//       }

//       handleNewMessage(newMessage);
//     };

//     userSocket.on('unreadCountUpdate', handleUnreadCountUpdate);
//     userSocket.on('newMessage', handleNewMessage);

//     return () => {
//       userSocket.off('unreadCountUpdate', handleUnreadCountUpdate);
//       userSocket.off('newMessage', handleNewMessage);
//     };
//   }, [userSocket, selectedChat, ownUser, handleNewMessage]);

//   // Reset unread count when selecting a chat
//   useEffect(() => {
//     if (selectedChat && unreadCounts[selectedChat._id] > 0) {
//       setUnreadCounts(prev => ({
//         ...prev,
//         [selectedChat._id]: 0
//       }));
//     }
//   }, [selectedChat, unreadCounts]);

//   // Mark messages as seen when chat is selected and window is visible
//   // useEffect(() => {
//   //   if (!selectedChat || !userSocket || !documentVisibleRef.current) return;

//   //   const messages = messagesByChat[selectedChat._id] || [];
//   //   const unreadMessages = messages
//   //     .filter(msg => !msg.seen && msg.sender._id !== ownUser?.id)
//   //     .map(msg => msg._id!)
//   //     .filter(id => id !== undefined) as string[];

//   //   if (unreadMessages.length > 0) {
//   //     userSocket.emit('messageSeen', {
//   //       userID: ownUser?.id,
//   //       chatID: selectedChat._id,
//   //       messageIds: unreadMessages
//   //     });
//   //   }
//   // }, [selectedChat, messagesByChat, userSocket, ownUser]);


//   useEffect(() => {
//     if (!selectedChat || !ownUser || !userSocket || !messagesByChat[selectedChat._id]?.length) return;
  
//     // Use a ref to track processing status
//     const processingRef = useRef(false);
    
//     // Debounce the seen status updates
//     const updateSeenStatus = debounce(async () => {
//       if (processingRef.current) return;
      
//       const unseenMessages = messagesByChat[selectedChat._id].filter(msg =>
//         msg.sender._id !== ownUser.id &&
//         !msg.seen &&
//         !unseenMessagesRef.current.has(msg._id!)
//       );
  
//       if (unseenMessages.length > 0) {
//         processingRef.current = true;
//         const messageIds = unseenMessages.map(msg => msg._id!);
        
//         // Mark messages as processed before sending
//         messageIds.forEach(id => unseenMessagesRef.current.add(id));
        
//         userSocket.emit("messageSeen", {
//           userID: ownUser.id,
//           chatID: selectedChat._id,
//           messageIds
//         });
        
//         processingRef.current = false;
//       }
//     }, 300);
  
//     // Only update seen status if document is visible
//     if (document.visibilityState === 'visible') {
//       updateSeenStatus();
//     }
  
//     return () => {
//       updateSeenStatus.cancel();
//     };
//   }, [selectedChat, messagesByChat, ownUser, userSocket]);

//   useEffect(() => {
//     const initializeSocket = () => {
//       if (!userSocket || !ownUser?.id || socketConnectedRef.current) return;

//       const connectSocket = () => {
//         userSocket.emit('join_user', ownUser.id);
//         socketConnectedRef.current = true;
//       };

//       if (userSocket.connected) {
//         connectSocket();
//       } else {
//         userSocket.connect();
//         userSocket.on('connect', connectSocket);
//       }

//       return () => {
//         userSocket.off('connect', connectSocket);
//         socketConnectedRef.current = false;
//       };
//     };

//     initializeSocket();

//     return () => {
//       if (userSocket) {
//         userSocket.disconnect();
//         socketConnectedRef.current = false;
//       }
//     };
//   }, [userSocket, ownUser]);

//   useEffect(() => {
//     if (!userSocket || !selectedChat?._id) return;

//     if (currentRoomRef.current) {
//       userSocket.emit('leave_room', currentRoomRef.current);
//     }

//     userSocket.emit('join_room', selectedChat._id);
//     currentRoomRef.current = selectedChat._id;

//     return () => {
//       if (currentRoomRef.current) {
//         userSocket.emit('leave_room', currentRoomRef.current);
//         currentRoomRef.current = null;
//       }
//     };
//   }, [selectedChat, userSocket]);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       documentVisibleRef.current = !document.hidden;
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   useEffect(() => {
//     if (!userSocket) return;
  
//     const handleMessageSeen = (data: { chatId: string; messageIds: string[]; seenBy: string }) => {
//       if (data.seenBy === ownUser?.id) return;
  
//       setMessagesByChat(prev => {
//         const chatMessages = prev[data.chatId] || [];
//         const updatedMessages = chatMessages.map(msg => {
//           if (msg.sender._id === ownUser?.id) {
//             return {
//               ...msg,
//               seen: msg.seen || data.messageIds.includes(msg._id!)
//             };
//           }
//           return msg;
//         });
  
//         return {
//           ...prev,
//           [data.chatId]: updatedMessages
//         };
//       });
//     };
  
//     const handleNewMessageEvent = (newMessage: IMessage) => {
//       handleNewMessage(newMessage);
//     };
  
//     userSocket.on('messageSeen', handleMessageSeen);
//     userSocket.on('newMessage', handleNewMessageEvent);
  
//     return () => {
//       userSocket.off('messageSeen', handleMessageSeen);
//       userSocket.off('newMessage', handleNewMessageEvent);
//     };
//   }, [userSocket, ownUser?.id, handleNewMessage]);



//   // useEffect(() => {
//   //   if (!userSocket) return;

//   //   const handleMessageSeen = (data: { chatId: string; messageIds: string[]; seenBy: string }) => {
//   //     if (data.seenBy === ownUser?.id) return;

//   //     setMessagesByChat(prev => {
//   //       const chatMessages = prev[data.chatId] || [];
//   //       const updatedMessages = chatMessages.map(msg => {
//   //         if (msg.sender._id === ownUser?.id) {
//   //           return {
//   //             ...msg,
//   //             seen: msg.seen || data.messageIds.includes(msg._id!)
//   //           };
//   //         }
//   //         return msg;
//   //       });

//   //       return {
//   //         ...prev,
//   //         [data.chatId]: updatedMessages
//   //       };
//   //     });
//   //   };

//   //   userSocket.on('messageSeen', handleMessageSeen);
//   //   userSocket.on('newMessage', (newMessage: IMessage) => {
//   //     handleNewMessage(newMessage);
//   //   });

//   //   return () => {
//   //     userSocket.off('messageSeen', handleMessageSeen);
//   //     userSocket.off('newMessage');
//   //   };
//   // }, [userSocket, ownUser?.id, handleNewMessage]);

//   // Fetch conversations and messages
//   const fetchConversations = useCallback(async () => {
//     try {
//       const response = await axiosInstance.get(`user/fetch-conversations/${ownUser?.id}`);
//       const sortedConversations = response.data.sort(
//         (a: IChatConversation, b: IChatConversation) =>
//           new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//       );
//       setConversations(sortedConversations);
//       await fetchUnreadCounts();
//     } catch (error) {
//       toast.error("Unable to fetch chats. Try again later.");
//     }
//   }, [ownUser]);

//   const fetchUnreadCounts = useCallback(async () => {
//     try {
//       const response = await axiosInstance.get(`user/fetch-unread-counts/${ownUser?.id}`);
//       setUnreadCounts(response.data);
//     } catch (error) {
//       console.error("Error fetching unread counts:", error);
//     }
//   }, [ownUser]);

//   const fetchMessages = useCallback(async (chatId: string) => {
//     try {
//       const response = await axiosInstance.get(`user/fetch-messages/${chatId}`);
//       setMessagesByChat(prev => ({
//         ...prev,
//         [chatId]: response.data
//       }));
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   }, []);

//   // Message sending
//   const handleSend = async () => {
//     if ((!message.trim() && !attachment) || !selectedChat || !ownUser || !userSocket) return;

//     try {
//       let mediaUrl = "";
//       if (attachment) {
//         mediaUrl = await uploadFile(attachment);
//       }

//       const receiver = selectedChat.users.find(user => user._id !== ownUser.id);
//       if (!receiver) {
//         toast.error("Receiver not found");
//         return;
//       }

//       const newMessage: IMessage = {
//         _id: `temp-${Date.now()}`,
//         chatId: selectedChat._id,
//         sender: {
//           _id: ownUser.id,
//           displayName: ownUser.username,
//           profileImage: ownUser.profileImage,
//         },
//         repliedTo: receiver._id,
//         content: message,
//         media: mediaUrl ? [{ type: attachment?.type.split("/")[0] as "image" | "video" | "audio", url: mediaUrl }] : undefined,
//         createdAt: new Date(),
//         seen: false,
//       };

//       console.log("New message Chat page: ", newMessage)

//       handleNewMessage(newMessage, true);
//       const { _id, ...messageToSend } = newMessage;
//       userSocket.emit('new_message', messageToSend);

//       clearMessageInput();
//     } catch (error) {
//       toast.error("Failed to send message");
//     }
//   };

//   // Helper functions
//   const clearMessageInput = () => {
//     setMessage("");
//     removeAttachment();
//   };

//   const removeAttachment = () => {
//     setAttachment(null);
//     setPreviewUrl(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const uploadFile = async (file: File): Promise<string> => {
//     try {
//       if (!file || !ownUser?.id) {
//         throw new Error("Attachment or user not found");
//       }
//       const { uploadUrl, key } = await getPresignedUrl(ownUser.id, "chat_media", API_URL);
//       await uploadImageToS3(uploadUrl, file);
//       return `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
//     } catch (error) {
//       toast.error("Failed to upload file");
//       throw error;
//     }
//   };

//   // Initial data loading
//   useEffect(() => {
//     if (selectedChat && ownUser) {
//       fetchMessages(selectedChat._id);
//     }
//   }, [selectedChat, ownUser, fetchMessages]);

//   useEffect(() => {
//     if (ownUser?.id) {
//       fetchConversations();
//     }
//   }, [ownUser, fetchConversations]);

//   return (
//     <div className="flex h-screen bg-gray-200 overflow-hidden">
//       <div className="w-1/4 bg-white shadow-md border-r border-gray-300">
//         <div className="p-4 bg-gray-800 flex items-center">
//           <SportsEsportsIcon className="text-white mr-2" />
//           <Typography variant="h6" className="text-white font-bold">Gamer Chat</Typography>
//         </div>
//         <ChatList
//           conversations={conversations}
//           setSelectedChat={setSelectedChat}
//           ownUser={ownUser}
//           unreadCounts={unreadCounts}
//         />
//       </div>

//       <div className="flex-1 flex flex-col bg-white">
//         {selectedChat ? (
//           <>
//             <ChatHeader
//               selectedChat={selectedChat}
//               onBack={() => setSelectedChat(null)}
//               ownUser={ownUser}
//             />
//             <ChatBody
//               messages={messagesByChat[selectedChat._id] || []}
//               selectedChat={selectedChat}
//               ownUser={ownUser}
//             />
//             <ChatFooter
//               message={message}
//               setMessage={setMessage}
//               handleSend={handleSend}
//               attachment={attachment}
//               setAttachment={setAttachment}
//               previewUrl={previewUrl}
//               setPreviewUrl={setPreviewUrl}
//               fileInputRef={fileInputRef}
//             />
//           </>
//         ) : (
//           <ChatBody messages={[]} selectedChat={null} ownUser={ownUser} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;




import React, { useCallback, useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";
import ChatList from "../../components/User/ChagPage/ChatList";
import ChatBody from "../../components/User/ChagPage/ChatBody";
import ChatFooter from "../../components/User/ChagPage/ChatFooter";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ChatHeader from "../../components/User/ChagPage/ChatHeader";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../Slices/userSlice/userSlice";
import { IChatConversation, IMessage } from "../../interfaces/userInterfaces/apiInterfaces";
import { toast } from "sonner";
import axiosInstance from "../../../src/services/userServices/axiosInstance";
import { getPresignedUrl, uploadImageToS3 } from "../../Utils/imageUploadHelper";
import { useSockets } from "../../context/socketContext";
import debounce from "lodash.debounce";

const ChatPage: React.FC = () => {
  const ownUser = useAppSelector(selectUser);
  const { userSocket } = useSockets();
  const API_URL = import.meta.env.VITE_STREAMING_SERVICE_API_URL;

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketConnectedRef = useRef<boolean>(false);
  const currentRoomRef = useRef<string | null>(null);
  const documentVisibleRef = useRef<boolean>(true);
  const unseenMessagesRef = useRef<Set<string>>(new Set());

  // State
  const [selectedChat, setSelectedChat] = useState<IChatConversation | null>(null);
  const [message, setMessage] = useState<string>("");
  const [conversations, setConversations] = useState<IChatConversation[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
  const [messagesByChat, setMessagesByChat] = useState<{ [chatId: string]: IMessage[] }>({});


  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedChat(null);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []); 
  
  const handleChatSelect = useCallback((chat: IChatConversation) => {
    if (!userSocket || !ownUser?.id) return;

    setSelectedChat(chat);
    
    // Clear local unread count immediately
    setUnreadCounts(prev => ({
      ...prev,
      [chat._id]: 0
    }));

    // Notify server that all messages in this chat are seen
    const unseenMessages = messagesByChat[chat._id]?.filter(msg => 
      msg.sender._id !== ownUser.id && !msg.seen
    ) || [];

    if (unseenMessages.length > 0) {
      const messageIds = unseenMessages.map(msg => msg._id!);
      userSocket.emit("messageSeen", {
        userID: ownUser.id,
        chatID: chat._id,
        messageIds
      });
    }

    // Emit event to update unread status on server
    userSocket.emit("markChatAsRead", {
      userID: ownUser.id,
      chatID: chat._id
    });
  }, [userSocket, ownUser, messagesByChat]);
  
  const handleNewMessage = useCallback(
    (msg: IMessage, isLocal: boolean = false) => {
      if (!msg.chatId || !msg.sender._id) return;

      setMessagesByChat(prev => {
        const chatMessages = [...(prev[msg.chatId] || [])];

        if (isLocal) {
          chatMessages.push(msg);
        } else {
          const tempMessageIndex = chatMessages.findIndex(existingMsg =>
            (existingMsg._id?.startsWith('temp-') &&
              existingMsg.sender._id === msg.sender._id &&
              existingMsg.content === msg.content &&
              existingMsg.chatId === msg.chatId) ||
            existingMsg._id === msg._id
          );

          if (tempMessageIndex !== -1) {
            chatMessages[tempMessageIndex] = msg;
          } else {
            chatMessages.push(msg);
          }
        }

        return {
          ...prev,
          [msg.chatId]: chatMessages
        };
      });

      setConversations(prevConvs => {
        const chatIndex = prevConvs.findIndex(c => c._id === msg.chatId);
        if (chatIndex === -1) return prevConvs;

        const updatedChat = {
          ...prevConvs[chatIndex],
          lastMessage: msg,
          updatedAt: new Date().toISOString()
        };

        const newConvs = [...prevConvs];
        newConvs.splice(chatIndex, 1);
        return [updatedChat, ...newConvs];
      });
    },
    []
  );

  const updateSeenStatus = useCallback(
    debounce(async (chatId: string, messages: IMessage[]) => {
      if (!userSocket || !ownUser?.id) return;

      const unseenMessages = messages.filter(msg =>
        msg.sender._id !== ownUser.id &&
        !msg.seen &&
        !unseenMessagesRef.current.has(msg._id!)
      );

      if (unseenMessages.length > 0) {
        const messageIds = unseenMessages.map(msg => msg._id!);
        messageIds.forEach(id => unseenMessagesRef.current.add(id));

        userSocket.emit("messageSeen", {
          userID: ownUser.id,
          chatID: chatId,
          messageIds
        });
      }
    }, 300),
    [userSocket, ownUser]
  );

  // Socket event handlers
  // useEffect(() => {
  //   if (!userSocket || !ownUser?.id) return;

  //   const handleUnreadCountUpdate = (data: { chatId: string; count: number }) => {
  //     setUnreadCounts(prev => ({
  //       ...prev,
  //       [data.chatId]: data.count
  //     }));
  //   };

  //   const handleNewMessageEvent = (newMessage: IMessage) => {
  //     if (selectedChat?._id === newMessage.chatId && documentVisibleRef.current) {
  //       userSocket.emit('messageSeen', {
  //         userID: ownUser.id,
  //         chatID: newMessage.chatId,
  //         messageIds: [newMessage._id!]
  //       });
  //     } else if (newMessage.sender._id !== ownUser.id) {
  //       setUnreadCounts(prev => ({
  //         ...prev,
  //         [newMessage.chatId]: (prev[newMessage.chatId] || 0) + 1
  //       }));
  //     }

  //     handleNewMessage(newMessage);
  //   };

  //   const handleMessageSeen = (data: { chatId: string; messageIds: string[]; seenBy: string }) => {
  //     if (data.seenBy === ownUser.id) return;

  //     setMessagesByChat(prev => {
  //       const chatMessages = prev[data.chatId] || [];
  //       const updatedMessages = chatMessages.map(msg => ({
  //         ...msg,
  //         seen: msg.sender._id === ownUser.id ? (msg.seen || data.messageIds.includes(msg._id!)) : msg.seen
  //       }));

  //       return {
  //         ...prev,
  //         [data.chatId]: updatedMessages
  //       };
  //     });
  //   };

  //   userSocket.on('unreadCountUpdate', handleUnreadCountUpdate);
  //   userSocket.on('newMessage', handleNewMessageEvent);
  //   userSocket.on('messageSeen', handleMessageSeen);

  //   return () => {
  //     userSocket.off('unreadCountUpdate', handleUnreadCountUpdate);
  //     userSocket.off('newMessage', handleNewMessageEvent);
  //     userSocket.off('messageSeen', handleMessageSeen);
  //   };
  // }, [userSocket, selectedChat, ownUser, handleNewMessage]);

  useEffect(() => {
    if (!userSocket || !ownUser?.id) return;

    const handleUnreadCountUpdate = (data: { chatId: string; count: number }) => {
      setUnreadCounts(prev => ({
        ...prev,
        [data.chatId]: selectedChat?._id === data.chatId ? 0 : data.count
      }));
    };

    const handleNewMessageEvent = (newMessage: IMessage) => {
      const isCurrentChat = selectedChat?._id === newMessage.chatId;
      const isFromCurrentUser = newMessage.sender._id === ownUser.id;

      if (isCurrentChat && documentVisibleRef.current && !isFromCurrentUser) {
        // Immediately mark as seen if chat is open and visible
        userSocket.emit('messageSeen', {
          userID: ownUser.id,
          chatID: newMessage.chatId,
          messageIds: [newMessage._id!]
        });

        // Ensure unread count remains 0 for current chat
        setUnreadCounts(prev => ({
          ...prev,
          [newMessage.chatId]: 0
        }));
      } else if (!isFromCurrentUser && !isCurrentChat) {
        // Increment unread count for other chats
        setUnreadCounts(prev => ({
          ...prev,
          [newMessage.chatId]: (prev[newMessage.chatId] || 0) + 1
        }));
      }

      handleNewMessage(newMessage);
    };

    const handleChatRead = (data: { chatId: string; userId: string }) => {
      if (data.userId === ownUser.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.chatId]: 0
        }));
      }
    };

    const handleMessageSeen = (data: { chatId: string; messageIds: string[]; seenBy: string }) => {
      if (data.seenBy === ownUser.id) return;

      setMessagesByChat(prev => {
        const chatMessages = prev[data.chatId] || [];
        const updatedMessages = chatMessages.map(msg => ({
          ...msg,
          seen: msg.sender._id === ownUser.id ? 
            (msg.seen || data.messageIds.includes(msg._id!)) : 
            msg.seen
        }));

        return {
          ...prev,
          [data.chatId]: updatedMessages
        };
      });

      // Update unread count in real-time when messages are seen
      if (data.seenBy !== ownUser.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.chatId]: 0
        }));
      }
    };

    // Subscribe to all relevant socket events
    userSocket.on('unreadCountUpdate', handleUnreadCountUpdate);
    userSocket.on('newMessage', handleNewMessageEvent);
    userSocket.on('messageSeen', handleMessageSeen);
    userSocket.on('chatRead', handleChatRead);

    return () => {
      userSocket.off('unreadCountUpdate', handleUnreadCountUpdate);
      userSocket.off('newMessage', handleNewMessageEvent);
      userSocket.off('messageSeen', handleMessageSeen);
      userSocket.off('chatRead', handleChatRead);
    };
  }, [userSocket, selectedChat, ownUser, handleNewMessage]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      documentVisibleRef.current = !document.hidden;
      
      // When document becomes visible, mark current chat as read
      if (!document.hidden && selectedChat?._id && userSocket && ownUser?.id) {
        userSocket.emit("markChatAsRead", {
          userID: ownUser.id,
          chatID: selectedChat._id
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedChat, userSocket, ownUser]);
  // Message seen effect
  useEffect(() => {
    if (!selectedChat || !messagesByChat[selectedChat._id]?.length) return;

    if (document.visibilityState === 'visible') {
      updateSeenStatus(selectedChat._id, messagesByChat[selectedChat._id]);
    }

    return () => {
      updateSeenStatus.cancel();
    };
  }, [selectedChat, messagesByChat, updateSeenStatus]);

  // Socket connection management
  useEffect(() => {
    if (!userSocket || !ownUser?.id || socketConnectedRef.current) return;

    const connectSocket = () => {
      userSocket.emit('join_user', ownUser.id);
      socketConnectedRef.current = true;
    };

    if (userSocket.connected) {
      connectSocket();
    } else {
      userSocket.connect();
      userSocket.on('connect', connectSocket);
    }

    return () => {
      userSocket.off('connect', connectSocket);
      socketConnectedRef.current = false;
    };
  }, [userSocket, ownUser]);

  // Chat room management
  useEffect(() => {
    if (!userSocket || !selectedChat?._id) return;

    if (currentRoomRef.current) {
      userSocket.emit('leave_room', currentRoomRef.current);
    }

    userSocket.emit('join_room', selectedChat._id);
    currentRoomRef.current = selectedChat._id;

    return () => {
      if (currentRoomRef.current) {
        userSocket.emit('leave_room', currentRoomRef.current);
        currentRoomRef.current = null;
      }
    };
  }, [selectedChat, userSocket]);

  // Visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      documentVisibleRef.current = !document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Data fetching functions
  const fetchUnreadCounts = useCallback(async () => {
    if (!ownUser?.id) return;
    try {
      const response = await axiosInstance.get(`user/fetch-unread-counts/${ownUser.id}`);
      setUnreadCounts(response.data);
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  }, [ownUser]);

  const fetchConversations = useCallback(async () => {
    if (!ownUser?.id) return;
    try {
      const response = await axiosInstance.get(`user/fetch-conversations/${ownUser.id}`);
      const sortedConversations = response.data.sort(
        (a: IChatConversation, b: IChatConversation) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setConversations(sortedConversations);
      await fetchUnreadCounts();
    } catch (error) {
      toast.error("Unable to fetch chats. Try again later.");
    }
  }, [ownUser, fetchUnreadCounts]);

  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      const response = await axiosInstance.get(`user/fetch-messages/${chatId}`);
      setMessagesByChat(prev => ({
        ...prev,
        [chatId]: response.data
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  // Upload helper
  const uploadFile = async (file: File): Promise<string> => {
    if (!file || !ownUser?.id) {
      throw new Error("Attachment or user not found");
    }
    try {
      const { uploadUrl, key } = await getPresignedUrl(ownUser.id, "chat_media", API_URL);
      await uploadImageToS3(uploadUrl, file);
      return `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      toast.error("Failed to upload file");
      throw error;
    }
  };

  // Message handling
  const clearMessageInput = () => {
    setMessage("");
    setAttachment(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!message.trim() && !attachment) || !selectedChat || !ownUser || !userSocket) return;

    try {
      let mediaUrl = "";
      if (attachment) {
        mediaUrl = await uploadFile(attachment);
      }

      const receiver = selectedChat.users.find(user => user._id !== ownUser.id);
      if (!receiver) {
        toast.error("Receiver not found");
        return;
      }

      const newMessage: IMessage = {
        _id: `temp-${Date.now()}`,
        chatId: selectedChat._id,
        sender: {
          _id: ownUser.id,
          displayName: ownUser.username,
          profileImage: ownUser.profileImage,
        },
        repliedTo: receiver._id,
        content: message,
        media: mediaUrl ? [{ type: attachment?.type.split("/")[0] as "image" | "video" | "audio", url: mediaUrl }] : undefined,
        createdAt: new Date(),
        seen: false,
      };

      handleNewMessage(newMessage, true);
      const { _id, ...messageToSend } = newMessage;
      userSocket.emit('new_message', messageToSend);

      clearMessageInput();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  // Initial data loading
  useEffect(() => {
    if (selectedChat && ownUser) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat, ownUser, fetchMessages]);

  useEffect(() => {
    if (ownUser?.id) {
      fetchConversations();
    }
  }, [ownUser, fetchConversations]);

  return (
    <div className="flex h-screen bg-gray-200 overflow-hidden">
      <div className="w-1/4 bg-white shadow-md border-r border-gray-300">
        <div className="p-4 bg-gray-800 flex items-center">
          <SportsEsportsIcon className="text-white mr-2" />
          <Typography variant="h6" className="text-white font-bold">Gamer Chat</Typography>
        </div>
        <ChatList
          conversations={conversations}
          // setSelectedChat={setSelectedChat}
          setSelectedChat={handleChatSelect}
          ownUser={ownUser}
          unreadCounts={unreadCounts}
        />
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            <ChatHeader
              selectedChat={selectedChat}
              onBack={() => setSelectedChat(null)}
              ownUser={ownUser}
            />
            <ChatBody
              messages={messagesByChat[selectedChat._id] || []}
              selectedChat={selectedChat}
              ownUser={ownUser}
            />
            <ChatFooter
              message={message}
              setMessage={setMessage}
              handleSend={handleSend}
              attachment={attachment}
              setAttachment={setAttachment}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              fileInputRef={fileInputRef}
            />
          </>
        ) : (
          <ChatBody messages={[]} selectedChat={null} ownUser={ownUser} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;