// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Typography } from "@mui/material";
// import ChatList from "../../components/User/ChagPage/ChatList";
// import ChatBody from "../../components/User/ChagPage/ChatBody";
// import ChatFooter from "../../components/User/ChagPage/ChatFooter";
// import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
// import ChatHeader from "../../components/User/ChagPage/ChatHeader";
// import { useAppSelector } from "../../store/hooks";
// import { selectUser } from "../../Slices/userSlice/userSlice";
// import { IChatConversation, IMedia, IMessage } from "../../interfaces/userInterfaces/apiInterfaces";
// import axiosInstanceChat from "../../services/userServices/axiosInstanceChat";
// import { toast } from "sonner";
// import { useSocket } from "../../services/userServices/socketProvider";
// import VideoCallContainer from "../../components/User/ChagPage/VideoCallContainer";
// import { Button, Snackbar } from '@mui/material'

// interface IncomingCall {
//   roomID: string;
//   callerId: string;
// }
// const ChatPage: React.FC = () => {
//   const ownUser = useAppSelector(selectUser);
//   const { socket } = useSocket();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [selectedChat, setSelectedChat] = useState<IChatConversation | null>(null);
//   const [message, setMessage] = useState<string>("");
//   const [conversations, setConversations] = useState<IChatConversation[]>([]);
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [attachment, setAttachment] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});


//   const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
//   const [inCall, setInCall] = useState(false);

//   useEffect(() => {
//     if (socket) {
//       socket.on('callInvitation', (data: any) => {
//         if (data.receiverId === ownUser?.id) {
//           setIncomingCall(data); // Store the incoming call details
//         }
//       });
//     }
//     return () => {
//       if (socket) {
//         socket.off('callInvitation');
//       }
//     };
//   }, [socket, ownUser?.id]);

//   const handleAcceptCall = () => {
//     setInCall(true); // Switch to in-call state
//     setIncomingCall(null); // Clear the call invitation notification
//   };

//   // Handle rejecting the video call
//   const handleRejectCall = () => {
//     setIncomingCall(null); // Clear the call invitation notification
  // };

  import React, { useCallback, useEffect, useRef, useState } from "react";
  import { Typography, Button, Snackbar } from "@mui/material";
  import ChatList from "../../components/User/ChagPage/ChatList";
  import ChatBody from "../../components/User/ChagPage/ChatBody";
  import ChatFooter from "../../components/User/ChagPage/ChatFooter";
  import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
  import ChatHeader from "../../components/User/ChagPage/ChatHeader";
  import { useAppSelector } from "../../store/hooks";
  import { selectUser } from "../../Slices/userSlice/userSlice";
  import { IChatConversation, IMedia, IMessage } from "../../interfaces/userInterfaces/apiInterfaces";
  import axiosInstanceChat from "../../services/userServices/axiosInstanceChat";
  import { toast } from "sonner";
  // import { useSocket } from "../../services/userServices/socketProvider";
  import VideoCallContainer from "../../components/User/ChagPage/VideoCallContainer";
  
  interface IncomingCall {
    roomID: string;
    callerId: string;
  }
  
  const ChatPage: React.FC = () => {
    const ownUser = useAppSelector(selectUser);
    // const { socket } = useSocket();
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const [selectedChat, setSelectedChat] = useState<IChatConversation | null>(null);
    const [message, setMessage] = useState<string>("");
    const [conversations, setConversations] = useState<IChatConversation[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [attachment, setAttachment] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
  
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const [inCall, setInCall] = useState(false);
  
    // useEffect(() => {
    //   if (socket) {
    //     socket.on('callInvitation', (data: IncomingCall) => {
    //       if (data.callerId !== ownUser?.id) {
    //         setIncomingCall(data);
    //       }
    //     });
    //   }
    //   return () => {
    //     if (socket) {
    //       socket.off('callInvitation');
    //     }
    //   };
    // }, [socket, ownUser?.id]);
  
    const handleAcceptCall = () => {
      // if (socket && incomingCall) {
      //   socket.emit('callAccepted', { callerId: incomingCall.callerId, roomID: incomingCall.roomID });
      //   setInCall(true);
      //   setIncomingCall(null);
      // }
    };
  
    const handleRejectCall = () => {
      // if (socket && incomingCall) {
      //   socket.emit('callRejected', { callerId: incomingCall.callerId });
      //   setIncomingCall(null);
      // }
    };


  // Fetch conversations and unread counts
  const fetchConversations = useCallback(async () => {
    try {
      const response = await axiosInstanceChat.get(`fetch-conversations/${ownUser?.id}`);
      const sortedConversations = response.data.sort(
        (a: IChatConversation, b: IChatConversation) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setConversations(sortedConversations);
      await fetchUnreadCounts();
    } catch (error) {
      toast.error("Unable to fetch chats. Try again later.");
      console.error("Error fetching conversations:", error);
    }
  }, [ownUser]);

  const fetchUnreadCounts = useCallback(async () => {
    try {
      const response = await axiosInstanceChat.get(`fetch-unread-counts/${ownUser?.id}`);
      setUnreadCounts(response.data);
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  }, [ownUser]);

  // Socket event handlers
  const handleNewMessage = useCallback(
    (msg: IMessage) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some((m) => m._id === msg._id);
        return messageExists ? prevMessages : [...prevMessages, msg];
      });
      setConversations((prevConversations) => {
        const chatIndex = prevConversations.findIndex((c) => c._id === msg.chatId);
  
        // If the conversation is already in the list, update it and move it to the top
        if (chatIndex !== -1) {
          const updatedChat = { 
            ...prevConversations[chatIndex], 
            updatedAt: new Date().toISOString() // Ensuring string format for updatedAt
          };
  
          const newConversations = [
            updatedChat, // Move the updated chat to the top
            ...prevConversations.filter((_, index) => index !== chatIndex) // Filter out the old chat position
          ];
          return newConversations;
        } else {
          // If the conversation is not found, add it (in case of a newly created chat)
          return prevConversations;
        }
      });
  
      if (msg.sender._id !== ownUser?.id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.chatId]: (prev[msg.chatId] || 0) + 1,
        }));
      }
    },
    [ownUser]
  );
  

  const handleUnreadCountUpdate = useCallback(
    ({ chatId, unreadCount }: { chatId: string; unreadCount: number }) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [chatId]: unreadCount,
      }));
    },
    []
  );

  const handleMessageRead = useCallback(({ chatId }: { chatId: string }) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.chatId === chatId && !msg.seen
          ? { ...msg, seen: true }
          : msg
      )
    );
  
    setUnreadCounts((prev) => ({
      ...prev,
      [chatId]: 0,
    }));
  }, []);
  
  // useEffect(() => {
  //   if (selectedChat && socket && ownUser) {
  //     socket.emit("markMessagesAsRead", {
  //       chatId: selectedChat._id,
  //       userId: ownUser.id,
  //     });
  //   }
  // }, [selectedChat, socket, ownUser]);

  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      const response = await axiosInstanceChat.get(`/fetch-messages/${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  // const handleSend = async () => {
  //   if ((message.trim() || attachment) && selectedChat && ownUser && socket) {
  //     let mediaUrl = "";

  //     if (attachment) {
  //       try {
  //         mediaUrl = await uploadFile(attachment);
  //       } catch (error) {
  //         return;
  //       }
  //     }

  //     const newMessage: IMessage = {
  //       chatId: selectedChat._id,
  //       sender: {
  //         _id: ownUser.id,
  //         displayName: ownUser.username,
  //         profileImage: ownUser.profileImage,
  //       },
  //       content: message,
  //       media: mediaUrl ? [{ type: attachment?.type.split("/")[0] as IMedia["type"], url: mediaUrl }] : undefined,
  //       createdAt: new Date(),
  //       seen: false,
  //     };

  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     socket.emit("message", newMessage);
  //     clearMessageInput();
  //   }
  // };
  const handleSend = async () => {
    if ((message.trim() || attachment) && selectedChat && ownUser && "socket") {
      let mediaUrl = "";
  
      if (attachment) {
        try {
          mediaUrl = await uploadFile(attachment);
        } catch (error) {
          return;
        }
      }
  
      const newMessage: IMessage = {
        chatId: selectedChat._id,
        sender: {
          _id: ownUser.id,
          displayName: ownUser.username,
          profileImage: ownUser.profileImage,
        },
        content: message,
        media: mediaUrl ? [{ type: attachment?.type.split("/")[0] as IMedia["type"], url: mediaUrl }] : undefined,
        createdAt: new Date(),
        seen: false,
      };
  
      // Update local messages
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  
      // Emit the message to the server via socket
      // socket.emit("message", newMessage);
  
      // Update conversation order: move the chat to the top of the list
      setConversations((prevConversations) => {
        const chatIndex = prevConversations.findIndex((c) => c._id === selectedChat._id);
  
        // If the chat is already in the list, update it and move it to the top
        if (chatIndex !== -1) {
          const updatedChat = {
            ...prevConversations[chatIndex],
            updatedAt: new Date().toISOString(),
          };
  
          return [
            updatedChat, // Move the updated chat to the top
            ...prevConversations.filter((_, index) => index !== chatIndex), // Keep the rest of the chats
          ];
        } else {
          // If the chat is not found, return as is (should not normally happen)
          return prevConversations;
        }
      });
  
      // Clear message input
      clearMessageInput();
    }
  };
  
  const clearMessageInput = () => {
    setMessage("");
    removeAttachment();
  };

  const removeAttachment = () => {
    setAttachment(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axiosInstanceChat.post("/upload-media", formData);
      return response.data.url;
    } catch (error) {
      toast.error("Failed to upload file");
      throw error;
    }
  };

  // useEffect(() => {
  //   if (ownUser?.id) {
  //     fetchConversations();
  //   }

  //   if (socket && ownUser) {
  //     socket.emit("joinUserRoom", ownUser.id);
  //     socket.on("newMessage", handleNewMessage);
  //     socket.on("unreadCountUpdate", handleUnreadCountUpdate);
  //     socket.on("messageRead", handleMessageRead);
  
  //     // Listen for conversation updates (to reorder conversations)
  //     socket.on("conversationUpdated", ({ chatId, updatedAt }: { chatId: string; updatedAt: string }) => {
  //       setConversations((prevConversations) => {
  //         const chatIndex = prevConversations.findIndex((c) => c._id === chatId);
  
  //         if (chatIndex !== -1) {
  //           const updatedChat = { ...prevConversations[chatIndex], updatedAt };
  
  //           const newConversations = [
  //             updatedChat, // Move the updated chat to the top
  //             ...prevConversations.filter((_, index) => index !== chatIndex),
  //           ];
  //           return newConversations;
  //         } else {
  //           return prevConversations;
  //         }
  //       });
  //     });
  //     socket.on('messageDeleted', ({ messageId, chatId }: { messageId: string; chatId: string }) => {
  //       setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
        
  //       // Update the last message in the conversation list if needed
  //       setConversations((prevConversations) => {
  //         return prevConversations.map((conv) => {
  //           if (conv._id === chatId) {
  //             const lastMessage = messages.find((msg) => msg._id !== messageId);
  //             return { ...conv, lastMessage };
  //           }
  //           return conv;
  //         });
  //       });
  //     });
  //     return () => {
  //       socket.off("newMessage", handleNewMessage);
  //       socket.off("unreadCountUpdate", handleUnreadCountUpdate);
  //       socket.off("messageRead", handleMessageRead);
  //       socket.off("conversationUpdated");
  //       socket.emit("leaveUserRoom", ownUser.id);
  //       socket.off('messageDeleted');

  //     };
  //   }
  // }, [socket, ownUser, handleNewMessage, handleUnreadCountUpdate, handleMessageRead]);

  // useEffect(() => {
  //   if (selectedChat && socket && ownUser) {
  //     fetchMessages(selectedChat._id);
  //     socket.emit("join", selectedChat._id);
  //     socket.emit("messageSeen", { chatId: selectedChat._id, userId: ownUser.id });
  //   }
  // }, [selectedChat, socket, ownUser, fetchMessages]);



  
  return (
    <div className="flex h-screen bg-gray-200 overflow-hidden">
      <div className="w-1/4 bg-white shadow-md border-r border-gray-300">
        <div className="p-4 bg-gray-800 flex items-center">
          <SportsEsportsIcon className="text-white mr-2" />
          <Typography variant="h6" className="text-white font-bold">Gamer Chat</Typography>
        </div>
        <ChatList
          conversations={conversations}
          setSelectedChat={setSelectedChat}
          ownUser={ownUser}
          unreadCounts={unreadCounts}
        />
      </div>

      <div className="flex-1 flex flex-col bg-white">
  {selectedChat ? (
    <>
      {/* Show ChatHeader and ChatFooter only when a chat is selected */}
      <ChatHeader
        selectedChat={selectedChat}
        onBack={() => setSelectedChat(null)}
        ownUser={ownUser}
      />
      <ChatBody messages={messages} selectedChat={selectedChat} ownUser={ownUser} />
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

<div>
      {/* Chat UI goes here */}
      {inCall && incomingCall?.roomID && (
  <VideoCallContainer roomID={incomingCall.roomID} />
)}

      {/* Snackbar notification for incoming call */}
      <Snackbar
        open={Boolean(incomingCall)}
        message={`Incoming video call from ${incomingCall?.callerId}`}
        action={
          <>
            <Button color="secondary" size="small" onClick={handleAcceptCall}>
              Accept
            </Button>
            <Button color="primary" size="small" onClick={handleRejectCall}>
              Reject
            </Button>
          </>
        }
      />
    </div>
    </>
  ) : (
    // Always render ChatBody, even when no chat is selected
    <ChatBody messages={[]} selectedChat={null} ownUser={ownUser} />
  )}
</div>

    </div>
  );
};

export default ChatPage;
