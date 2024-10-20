import React from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText, Badge, Typography } from "@mui/material";
import { IChatConversation } from "../../../interfaces/userInterfaces/apiInterfaces";

interface ChatListProps {
  setSelectedChat: (chat: IChatConversation) => void;
  ownUser: any;
  conversations: IChatConversation[];
  unreadCounts: { [key: string]: number };
}

const ChatList: React.FC<ChatListProps> = ({ setSelectedChat, ownUser, conversations, unreadCounts }) => {
  return (
    <>
      {conversations.map((conversation) => {
        const otherUser = conversation.users.find((user) => user._id !== ownUser.id);
        const unreadCount = unreadCounts[conversation._id] || 0;

        return (
          <ListItem
            button
            key={conversation._id}
            className="hover:bg-gray-100"
            onClick={() => setSelectedChat(conversation)}
          >
            <ListItemAvatar>
              <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
                <Avatar
                  src={otherUser?.profileImage}
                  style={{ backgroundColor: "#FB923C", color: "white" }}
                >
                  {otherUser?.displayName?.[0] || "?"}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body1" className="font-semibold">
                  {otherUser?.displayName || "Unknown User"}
                </Typography>
              }
              secondary={unreadCount > 0 ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : null}
            />
          </ListItem>
        );
      })}
    </>
  );
};

export default ChatList;
