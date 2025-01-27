import React from "react";
import { Avatar, IconButton, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideoCallIcon from "@mui/icons-material/VideoCall"; // Import VideoCallIcon
// import { useSocket } from "../../../services/userServices/socketProvider";
import { startVideoCall } from "../../../Utils/VideoCallUtils";

interface ChatHeaderProps {
  selectedChat: any;
  onBack: () => void;
  ownUser: any;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedChat, onBack, ownUser }) => {
  // const { socket } = useSocket();
  const otherUser = selectedChat
    ? selectedChat.users.find((user: any) => user._id !== ownUser.id)
    : null;


    const handleVideoCall = () => {
      // if(socket){
      // const roomID = `room_${selectedChat._id}`;
      // socket.emit("callInvitation", {
      //   callerId: ownUser.id,
      //   receiverId: otherUser._id,
      //   roomID,
      // });
  
      // Start the video call
      // startVideoCall(roomID, ownUser.id, ownUser.username);}
    };
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* Back Button */}
      <div className="flex items-center">
        <IconButton className="text-white" onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>

        {/* User Info */}
        <div className="flex items-center">
          <Avatar
            src={otherUser?.profileImage}
            style={{ backgroundColor: "#FB923C", color: "white" }}
          >
            {otherUser?.displayName?.[0] || "?"}
          </Avatar>
          <Typography variant="h6" className="p-2 font-semibold">
            {otherUser?.displayName || "Chat"}
          </Typography>
        </div>
      </div>

      {/* Right-side Buttons */}
      <div className="flex items-center">
        {/* Video Call Button */}
        {/* <IconButton className="text-white" onClick={handleVideoCall}>
          <VideoCallIcon />
        </IconButton> */}

        {/* Options Button */}
        {/* <IconButton className="text-white">
          <MoreVertIcon />
        </IconButton> */}
      </div>
    </div>
  );
};

export default ChatHeader;
