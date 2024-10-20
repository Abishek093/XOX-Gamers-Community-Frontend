import React, { useRef, useState } from "react";
import { IconButton, TextField, Popover } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AttachmentPreview from "./AttachmentPreview";
import { toast } from "sonner";

interface ChatFooterProps {
  message: string;
  setMessage: (msg: string | ((prevMessage: string) => string)) => void;
  handleSend: () => void;
  attachment: File | null
  setAttachment: React.Dispatch<React.SetStateAction<File | null>>
  previewUrl: string | null
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>
  fileInputRef:React.RefObject<HTMLInputElement>;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ message, setMessage, handleSend, attachment,setAttachment,previewUrl,setPreviewUrl, fileInputRef}) => {

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  const handleEmojiButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseEmojiPicker = () => {
    setAnchorEl(null);
  };

  const removeAttachment = () => {
    setAttachment(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size is larger than 10 MB");
        return;
      }
      setAttachment(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  return (
    <>
      <div className="bg-white p-4 flex flex-col border-t border-gray-300">
        {attachment && (
          <AttachmentPreview
            previewUrl={previewUrl}
            attachment={attachment}
            removeAttachment={removeAttachment}
          />
        )}
        <div className="flex w-full items-center">
          <IconButton
            className="text-gray-600 hover:text-gray-800"
            onClick={handleEmojiButtonClick}
          >
            <EmojiEmotionsIcon />
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleCloseEmojiPicker}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Popover>
          <IconButton className="text-gray-600 hover:text-gray-800" onClick={handleAttachmentClick}>
            <AttachFileIcon />
          </IconButton>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*,audio/*,application/pdf,.gif"
            style={{ display: 'none' }}
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="mx-2"
            InputProps={{
              style: {
                backgroundColor: "white",
                borderRadius: "20px",
              },
            }}
          />
          <IconButton
            style={{ backgroundColor: "#FB923C", color: "white" }}
            className="hover:bg-orange-500 rounded-full p-2"
            onClick={handleSend}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default ChatFooter;
