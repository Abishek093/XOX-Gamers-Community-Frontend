// import React, { useEffect, useRef, useState } from "react";
// import { Typography } from "@mui/material";
// import GamepadIcon from "@mui/icons-material/Gamepad";
// import { IMessage } from "../../../interfaces/userInterfaces/apiInterfaces";
// import { format } from 'date-fns';
// import { Avatar } from "@mui/material";
// import { BsCheck2, BsCheck2All } from "react-icons/bs"; 


// interface ChatBodyProps {
//   selectedChat: any;
//   ownUser: any;
//   messages: IMessage[]
// }

// const ChatBody: React.FC<ChatBodyProps> = ({ selectedChat, ownUser, messages }) => {

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);


//   useEffect(() => {
//     if (!isLoading) {
//       scrollToBottom();
//     }
//   }, [messages, isLoading]);
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   if (!selectedChat) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white">
//         <div className="w-64 h-64 bg-gray-800 rounded-lg shadow-lg p-4 mb-8 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20"></div>
//           <div className="relative z-10 h-full flex flex-col items-center justify-center">
//             <GamepadIcon style={{ fontSize: 64, marginBottom: 16 }} />
//             <Typography variant="h5" className="text-center mb-4 font-pixel">
//               Gamer Chat
//             </Typography>
//             <Typography variant="body2" className="text-center mb-4 font-pixel">
//               Select chat to start Conversation!
//             </Typography>
//             <div className="flex space-x-2">
//               <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
//               <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-75"></div>
//               <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Check if messages exist in the selectedChat object
//   // if (!selectedChat.messages || selectedChat.messages.length === 0) {
//   //   return (
//   //     <div className="flex-grow flex items-center justify-center">
//   //       <Typography variant="h6" color="textSecondary">
//   //         No messages yet.
//   //       </Typography>
//   //     </div>
//   //   );
//   // }

//   const renderMessage = (msg: IMessage, isOwnMessage: boolean) => {
//     const messageTime = msg.createdAt ? format(new Date(msg.createdAt), 'HH:mm') : 'Unknown Time';
  
//     return (
//       <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
//         {!isOwnMessage && (
//           <Avatar
//             src={msg.sender.profileImage}
//             style={{ backgroundColor: "#FB923C", color: "white" }}
//             className="mr-2"
//           >
//             {msg.sender.displayName?.[0] || '?'}
//           </Avatar>
//         )}
//         <div className={`rounded-lg p-3 max-w-xs ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
//           {msg.content && <Typography>{msg.content}</Typography>}
//           {msg.media && msg.media.map((media, index) => (
//             <div key={index} className="mt-2">
//               {media.type === 'image' && (
//                 <img src={media.url} alt="Shared image" className="max-w-full h-auto rounded" />
//               )}
//               {media.type === 'video' && (
//                 <video src={media.url} controls className="max-w-full h-auto rounded" />
//               )}
//               {media.type === 'audio' && (
//                 <audio src={media.url} controls className="max-w-full" />
//               )}
//               {media.type === 'application' && (
//                 <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                   View Document
//                 </a>
//               )}
//             </div>
//           ))}
//           <div className="text-xs mt-1 text-gray-500 flex justify-end items-center">
//             <span>{messageTime}</span>
//             {isOwnMessage && (
//               <span className="ml-1">
//                 {msg.seen ? (
//                   <BsCheck2All className="text-white" /> // Double tick when seen
//                 ) : (
//                   <BsCheck2 className="text-white" /> // Single tick when not seen
//                 )}
//               </span>
//             )}
//           </div>
//         </div>
//         {isOwnMessage && (
//           <Avatar
//             src={ownUser?.profileImage}
//             style={{ backgroundColor: "#FB923C", color: "white" }}
//             className="ml-2"
//           >
//             {ownUser?.username?.[0] || '?'}
//           </Avatar>
//         )}
//       </div>
//     );
//   };
//   return (
//     <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
//       {isLoading ? (
//         <div className="flex justify-center items-center h-full">
//           <Typography>Loading messages...</Typography>
//         </div>
//       ) : (
//         messages.map((msg, index) => {
//           const isOwnMessage = msg.sender._id === ownUser?.id;
//           return (
//             <div key={index}>
//               {renderMessage(msg, isOwnMessage)}
//             </div>
//           );
//         })
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//   );
// };

// export default ChatBody;



// import React, { useEffect, useRef, useState } from "react";
// import { Typography } from "@mui/material";
// import GamepadIcon from "@mui/icons-material/Gamepad";
// import { IMessage } from "../../../interfaces/userInterfaces/apiInterfaces";
// import { format, isSameDay, subDays } from 'date-fns';
// import { Avatar } from "@mui/material";
// import { BsCheck2, BsCheck2All } from "react-icons/bs"; 


// interface ChatBodyProps {
//   selectedChat: any;
//   ownUser: any;
//   messages: IMessage[]
// }

// const ChatBody: React.FC<ChatBodyProps> = ({ selectedChat, ownUser, messages }) => {

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   useEffect(() => {
//     if (!isLoading) {
//       scrollToBottom();
//     }
//   }, [messages, isLoading]);
  
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const getDateLabel = (date: Date) => {
//     const today = new Date();
//     if (isSameDay(date, today)) {
//       return "Today";
//     } else if (isSameDay(date, subDays(today, 1))) {
//       return "Yesterday";
//     } else {
//       return format(date, 'MMMM dd, yyyy');
//     }
//   };

//   // Group messages by date
//   const groupedMessages = messages.reduce((acc, message) => {
//     // Ensure message.createdAt is defined
//     const messageDate = message.createdAt ? new Date(message.createdAt) : new Date();
//     const dateKey = format(messageDate, 'yyyy-MM-dd');
  
//     if (!acc[dateKey]) {
//       acc[dateKey] = [];
//     }
//     acc[dateKey].push(message);
//     return acc;
//   }, {} as Record<string, IMessage[]>);

//   const renderMessage = (msg: IMessage, isOwnMessage: boolean) => {
//     const messageTime = msg.createdAt ? format(new Date(msg.createdAt), 'HH:mm') : 'Unknown Time';

//     return (
//       <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
//         {!isOwnMessage && (
//           <Avatar
//             src={msg.sender.profileImage}
//             style={{ backgroundColor: "#FB923C", color: "white" }}
//             className="mr-2"
//           >
//             {msg.sender.displayName?.[0] || '?'}
//           </Avatar>
//         )}
//         <div className={`rounded-lg p-3 max-w-xs ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
//           {msg.content && <Typography>{msg.content}</Typography>}
//           {msg.media && msg.media.map((media, index) => (
//             <div key={index} className="mt-2">
//               {media.type === 'image' && (
//                 <img src={media.url} alt="Shared image" className="max-w-full h-auto rounded" />
//               )}
//               {media.type === 'video' && (
//                 <video src={media.url} controls className="max-w-full h-auto rounded" />
//               )}
//               {media.type === 'audio' && (
//                 <audio src={media.url} controls className="max-w-full" />
//               )}
//               {media.type === 'application' && (
//                 <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                   View Document
//                 </a>
//               )}
//             </div>
//           ))}
//           <div className="text-xs mt-1 text-gray-500 flex justify-end items-center">
//             <span>{messageTime}</span>
//             {isOwnMessage && (
//               <span className="ml-1">
//                 {msg.seen ? (
//                   <BsCheck2All className="text-white" /> // Double tick when seen
//                 ) : (
//                   <BsCheck2 className="text-white" /> // Single tick when not seen
//                 )}
//               </span>
//             )}
//           </div>
//         </div>
//         {isOwnMessage && (
//           <Avatar
//             src={ownUser?.profileImage}
//             style={{ backgroundColor: "#FB923C", color: "white" }}
//             className="ml-2"
//           >
//             {ownUser?.username?.[0] || '?'}
//           </Avatar>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
//       {isLoading ? (
//         <div className="flex justify-center items-center h-full">
//           <Typography>Loading messages...</Typography>
//         </div>
//       ) : (
//         Object.keys(groupedMessages).map((dateKey) => {
//           const date = new Date(dateKey); // Convert string dateKey back to Date
//           const dateLabel = getDateLabel(date);

//           return (
//             <div key={dateKey}>
//               {/* Render date label */}
//               <div className="text-center text-gray-500 my-2">
//                 <Typography variant="body2">{dateLabel}</Typography>
//               </div>

//               {/* Render messages for that date */}
//               {groupedMessages[dateKey].map((msg, index) => {
//                 const isOwnMessage = msg.sender._id === ownUser?.id;
//                 return (
//                   <div key={index}>
//                     {renderMessage(msg, isOwnMessage)}
//                   </div>
//                 );
//               })}
//             </div>
//           );
//         })
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//   );
// };

// export default ChatBody;






// import React, { useEffect, useRef, useState } from "react";
// import { Typography } from "@mui/material";
// import GamepadIcon from "@mui/icons-material/Gamepad";
// import { IMessage } from "../../../interfaces/userInterfaces/apiInterfaces";
// import { format, isSameDay, subDays } from 'date-fns';
// import { Avatar } from "@mui/material";
// import { BsCheck2, BsCheck2All } from "react-icons/bs";
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ConfirmationModal from './ConfirmationModal'; // We'll create this component
// import { useSocket } from '../../../services/userServices/socketProvider';


// interface ChatBodyProps {
//   selectedChat: any;
//   ownUser: any;
//   messages: IMessage[];
// }

// const ChatBody: React.FC<ChatBodyProps> = ({ selectedChat, ownUser, messages }) => {
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const { socket } = useSocket();


//   useEffect(() => {
//     if (!isLoading) {
//       scrollToBottom();
//     }
//   }, [messages, isLoading]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const getDateLabel = (date: Date) => {
//     const today = new Date();
//     if (isSameDay(date, today)) {
//       return "Today";
//     } else if (isSameDay(date, subDays(today, 1))) {
//       return "Yesterday";
//     } else {
//       return format(date, 'MMMM dd, yyyy');
//     }
//   };

//   const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, message: IMessage) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedMessage(message);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDeleteClick = () => {
//     handleMenuClose();
//     setIsDeleteModalOpen(true);
//   };

//   const handleDeleteConfirm = () => {
//     if (selectedMessage && socket) {
//       socket.emit('deleteMessage', { messageId: selectedMessage._id, chatId: selectedChat._id });
//     }
//     setIsDeleteModalOpen(false);
//   };

//   // Group messages by date
//   const groupedMessages = messages.reduce((acc, message) => {
//     const messageDate = message.createdAt ? new Date(message.createdAt) : new Date();
//     const dateKey = format(messageDate, 'yyyy-MM-dd');
//     if (!acc[dateKey]) {
//       acc[dateKey] = [];
//     }
//     acc[dateKey].push(message);
//     return acc;
//   }, {} as Record<string, IMessage[]>);

//   const renderMessage = (msg: IMessage, isOwnMessage: boolean) => {
//     const messageTime = msg.createdAt ? format(new Date(msg.createdAt), 'HH:mm') : 'Unknown Time';

//     return (
//       <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
//         {!isOwnMessage && (
//           <Avatar
//             src={msg.sender.profileImage}
//             style={{ backgroundColor: "#FB923C", color: "white" }}
//             className="mr-2"
//           >
//             {msg.sender.displayName?.[0] || '?'}
//           </Avatar>
//         )}
//         <div className={`rounded-lg p-3 max-w-xs ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
//           {msg.content && <Typography>{msg.content}</Typography>}
//           {msg.media && msg.media.map((media, index) => (
//             <div key={index} className="mt-2">
//               {media.type === 'image' && (
//                 <img src={media.url} alt="Shared image" className="max-w-full h-auto rounded" />
//               )}
//               {media.type === 'video' && (
//                 <video src={media.url} controls className="max-w-full h-auto rounded" />
//               )}
//               {media.type === 'audio' && (
//                 <audio src={media.url} controls className="max-w-full" />
//               )}
//               {media.type === 'application' && (
//                 <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                   View Document
//                 </a>
//               )}
//             </div>
//           ))}
//           <div className="text-xs mt-1 text-gray-500 flex justify-end items-center">
//             <span>{messageTime}</span>
//             {isOwnMessage && (
//               <span className="ml-1">
//                 {msg.seen ? (
//                   <BsCheck2All className="text-white" /> // Double tick when seen
//                 ) : (
//                   <BsCheck2 className="text-white" /> // Single tick when not seen
//                 )}
//               </span>
//             )}
//           </div>
//         </div>
//         {isOwnMessage && (
//           <Avatar
//             src={ownUser?.profileImage}
//             style={{ backgroundColor: "#FB923C", color: "white" }}
//             className="ml-2"
//           >
//             {ownUser?.username?.[0] || '?'}
//           </Avatar>
//         )}
//       </div>
//     );
//   };

//   // Render default page when no chat is selected
//   if (!selectedChat) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white">
//         <div className="w-64 h-64 bg-gray-800 rounded-lg shadow-lg p-4 mb-8 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20"></div>
//           <div className="relative z-10 h-full flex flex-col items-center justify-center">
//             <GamepadIcon style={{ fontSize: 64, marginBottom: 16 }} />
//             <Typography variant="h5" className="text-center mb-4 font-pixel">
//               Gamer Chat
//             </Typography>
//             <Typography variant="body2" className="text-center mb-4 font-pixel">
//               Select a chat to start a conversation!
//             </Typography>
//             <div className="flex space-x-2">
//               <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
//               <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-75"></div>
//               <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render chat messages if selectedChat exists
//   return (
//     <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
//       {isLoading ? (
//         <div className="flex justify-center items-center h-full">
//           <Typography>Loading messages...</Typography>
//         </div>
//       ) : (
//         Object.keys(groupedMessages).map((dateKey) => {
//           const date = new Date(dateKey); // Convert string dateKey back to Date
//           const dateLabel = getDateLabel(date);

//           return (
//             <div key={dateKey}>
//               {/* Render date label */}
//               <div className="text-center text-gray-500 my-2">
//                 <Typography variant="body2">{dateLabel}</Typography>
//               </div>

//               {/* Render messages for that date */}
//               {groupedMessages[dateKey].map((msg, index) => {
//                 const isOwnMessage = msg.sender._id === ownUser?.id;
//                 return (
//                   <div key={index}>
//                     {renderMessage(msg, isOwnMessage)}
//                   </div>
//                 );
//               })}
//             </div>
//           );
//         })
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//   );
// };

// export default ChatBody;


import React, { useEffect, useRef, useState } from "react";
import { Typography, IconButton, Menu, MenuItem, Avatar, Fade } from "@mui/material";
import GamepadIcon from "@mui/icons-material/Gamepad";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationModal from './ConfirmationModal';
// import { useSocket } from '../../../services/userServices/socketProvider';
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import { IMessage } from "../../../interfaces/userInterfaces/apiInterfaces";
import { format, isSameDay, subDays } from 'date-fns';
import { CiMenuKebab } from "react-icons/ci";

interface ChatBodyProps {
  selectedChat: any;
  ownUser: any;
  messages: IMessage[];
}

const ChatBody: React.FC<ChatBodyProps> = ({ selectedChat, ownUser, messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const { socket } = useSocket();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getDateLabel = (date: Date) => {
    const today = new Date();
    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, subDays(today, 1))) {
      return "Yesterday";
    } else {
      return format(date, 'MMMM dd, yyyy');
    }
  };

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
    // if (selectedMessage && socket) {
    //   socket.emit('deleteMessage', { messageId: selectedMessage._id, chatId: selectedChat._id });
    // }
    setIsDeleteModalOpen(false);
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const messageDate = message.createdAt ? new Date(message.createdAt) : new Date();
    const dateKey = format(messageDate, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(message);
    return acc;
  }, {} as Record<string, IMessage[]>);

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
        <div className="relative flex items-center"> {/* Flex container to hold both message and icon */}
          {/* Adjust position of the 3-dot button */}
          {isOwnMessage && (
            <Fade in={true}>
              <IconButton
                size="small"
                className="absolute left-[0px] top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => handleMenuOpen(e, msg)}
              >
                <CiMenuKebab fontSize="small" />
              </IconButton>
            </Fade>
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
                    <BsCheck2All className="text-white" />
                  ) : (
                    <BsCheck2 className="text-white" />
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
          const date = new Date(dateKey);
          const dateLabel = getDateLabel(date);

          return (
            <div key={dateKey}>
              <div className="text-center text-gray-500 my-4">
                <Typography variant="body2" className="bg-gray-200 inline-block px-3 py-1 rounded-full">
                  {dateLabel}
                </Typography>
              </div>
              {groupedMessages[dateKey].map((msg, index) => {
                const isOwnMessage = msg.sender._id === ownUser?.id;
                return (
                  <div key={index}>
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