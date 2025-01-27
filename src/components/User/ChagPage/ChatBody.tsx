import React, { useEffect, useRef, useState } from "react";
import { Typography, IconButton, Menu, MenuItem, Avatar, Fade } from "@mui/material";
import GamepadIcon from "@mui/icons-material/Gamepad";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationModal from './ConfirmationModal';
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import { IMessage } from "../../../interfaces/userInterfaces/apiInterfaces";
import { format, isSameDay, subDays } from 'date-fns';
import { useSockets } from "../../../context/socketContext";

interface ChatBodyProps {
  selectedChat: any;
  ownUser: any;
  messages: IMessage[];
}

const ChatBody: React.FC<ChatBodyProps> = ({ selectedChat, ownUser, messages }) => {
  // console.log(messages)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userSocket } = useSockets();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [localMessages, setLocalMessages] = useState<IMessage[]>(messages);
  const unseenMessagesRef = useRef<Set<string>>(new Set());
  const lastSeenUpdateRef = useRef<number>(0);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);



  // Check and update unseen messages
  // useEffect(() => {
  //   if (!selectedChat || !ownUser || !userSocket || !messages.length) return;

  //   const checkUnseenMessages = () => {
  //     const now = Date.now();
  //     if (now - lastSeenUpdateRef.current < 1000) return; // Debounce for 1 second

  //     const unseenMessages = messages.filter(msg =>
  //       msg.sender._id !== ownUser.id &&
  //       !msg.seen &&
  //       !unseenMessagesRef.current.has(msg._id!)
  //     );

  //     if (unseenMessages.length > 0) {
  //       const messageIds = unseenMessages.map(msg => msg._id!);
        
  //       userSocket.emit("messageSeen", {
  //         userID: ownUser.id,
  //         chatID: selectedChat._id,
  //         messageIds
  //       });

  //       messageIds.forEach(id => unseenMessagesRef.current.add(id));
  //       lastSeenUpdateRef.current = now;
  //     }
  //   };

  //   const debouncedCheck = setTimeout(checkUnseenMessages, 300);

  //   const handleVisibilityChange = () => {
  //     if (!document.hidden) {
  //       checkUnseenMessages();
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);
    
  //   return () => {
  //     clearTimeout(debouncedCheck);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [selectedChat, messages, ownUser, userSocket]);

  useEffect(() => {
    if (!selectedChat || !ownUser || !userSocket || !messages.length) return;
  
    const now = Date.now();
    if (now - lastSeenUpdateRef.current < 1000) return; // Debounce check
  
    const unseenMessages = messages.filter(msg =>
      msg.sender._id !== ownUser.id &&
      !msg.seen &&
      !unseenMessagesRef.current.has(msg._id!)
    );
  
    if (unseenMessages.length > 0) {
      const messageIds = unseenMessages.map(msg => msg._id!);
      
      // Set processed flag before emitting
      messageIds.forEach(id => unseenMessagesRef.current.add(id));
      lastSeenUpdateRef.current = now;
  
      userSocket.emit("messageSeen", {
        userID: ownUser.id,
        chatID: selectedChat._id,
        messageIds
      });
    }
  }, [selectedChat, messages, ownUser, userSocket]);

  // Clear unseen messages when changing chats
  useEffect(() => {
    unseenMessagesRef.current.clear();
  }, [selectedChat?._id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const getDateLabel = (date: Date): string => {
    const today = new Date();
    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, subDays(today, 1))) {
      return "Yesterday";
    }
    return format(date, 'MMMM dd, yyyy');
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const messageDate = message.createdAt ? new Date(message.createdAt) : new Date();
    const dateKey = format(messageDate, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(message);
    return acc;
  }, {} as Record<string, IMessage[]>);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, message: IMessage) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
  };

  const renderMessage = (msg: IMessage, isOwnMessage: boolean) => {
    const messageTime = msg.createdAt ? format(new Date(msg.createdAt), 'HH:mm') : 'Unknown Time';

    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group relative`}>
        {!isOwnMessage && (
          <Avatar
            src={msg.sender.profileImage}
            style={{ backgroundColor: "#FB923C", color: "white" }}
            className="mr-2 mt-1"
          >
            {msg.sender.displayName?.[0] || '?'}
          </Avatar>
        )}
        <div className="relative flex items-center">
          {isOwnMessage && (
            <div className="text-xs text-gray-500 flex items-center ml-1">
              {msg.seen ? (
                <BsCheck2All className="text-white" size={16} />
              ) : (
                <BsCheck2 className="text-white" size={16} />
              )}
            </div>
          )}
          <div className={`rounded-lg p-3 max-w-xs ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} shadow-md`}>
            {msg.content && <Typography>{msg.content}</Typography>}
            {msg.media && msg.media.map((media, index) => (
              <div key={index} className="mt-2">
                {media.type === 'image' && (
                  <img src={media.url} alt="Shared image" className="max-w-full h-auto rounded" />
                )}
                {media.type === 'video' && (
                  <video src={media.url} controls className="max-w-full h-auto rounded" />
                )}
                {media.type === 'audio' && (
                  <audio src={media.url} controls className="max-w-full" />
                )}
                {media.type === 'application' && (
                  <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    View Document
                  </a>
                )}
              </div>
            ))}
            <div className="text-xs mt-1 text-gray-400 flex justify-end items-center">
              <span>{messageTime}</span>
              {isOwnMessage && (
                <span className="ml-1">
                  {msg.seen ? (
                    <BsCheck2All className="text-white" size={16} />
                  ) : (
                    <BsCheck2 className="text-white" size={16} />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
        {isOwnMessage && (
          <Avatar
            src={ownUser?.profileImage}
            style={{ backgroundColor: "#FB923C", color: "white" }}
            className="ml-2 mt-1"
          >
            {ownUser?.username?.[0] || '?'}
          </Avatar>
        )}
      </div>
    );
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="w-64 h-64 bg-gray-800 rounded-lg shadow-lg p-4 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            <GamepadIcon style={{ fontSize: 64, marginBottom: 16 }} />
            <Typography variant="h5" className="text-center mb-4 font-pixel">
              Gamer Chat
            </Typography>
            <Typography variant="body2" className="text-center mb-4 font-pixel">
              Select a chat to start a conversation!
            </Typography>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Typography>Loading messages...</Typography>
        </div>
      ) : (
        Object.keys(groupedMessages).map((dateKey) => {
          const messages = localMessages.filter(msg => {
            const messageDate = msg.createdAt ? new Date(msg.createdAt) : new Date();
            return format(messageDate, 'yyyy-MM-dd') === dateKey;
          });

          const date = new Date(dateKey);
          const dateLabel = getDateLabel(date);

          return (
            <div key={dateKey}>
              <div className="text-center text-gray-500 my-4">
                <Typography variant="body2" className="bg-gray-200 inline-block px-3 py-1 rounded-full">
                  {dateLabel}
                </Typography>
              </div>
              {messages.map((msg, index) => {
                const isOwnMessage = msg.sender._id === ownUser?.id;
                return (
                  <div key={msg._id || index}>
                    {renderMessage(msg, isOwnMessage)}
                  </div>
                );
              })}
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleDeleteClick} className="text-red-500 hover:bg-red-50">
          <DeleteIcon fontSize="small" className="mr-2" />
          Delete
        </MenuItem>
      </Menu>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        content="Are you sure you want to delete this message? This action cannot be undone."
      />
    </div>
  );
};

export default ChatBody;