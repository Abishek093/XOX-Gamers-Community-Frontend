import React from 'react';
import { IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

interface AttachmentPreviewProps {
  previewUrl: string | null;
  attachment: File | null;
  removeAttachment: () => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ previewUrl, attachment, removeAttachment }) => {
  if (!attachment) return null;

  const isImage = attachment.type.startsWith('image/');
  const isAudio = attachment.type.startsWith('audio/');
  const isVideo = attachment.type.startsWith('video/');
  const isPdf = attachment.type === 'application/pdf';

  return (
    <div className="mb-4 relative w-full max-w-sm mx-auto bg-gray-100 rounded-lg shadow-md overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <IconButton
          className="bg-red-500 hover:bg-red-600 text-white"
          size="small"
          onClick={removeAttachment}
        >
          <CloseIcon />
        </IconButton>
      </div>
      
      <div className="p-4">
        {isImage && previewUrl && (
          <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
        )}
        {!isImage && (
          <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded">
            {isAudio && <AudiotrackIcon style={{ fontSize: 64, color: '#4A5568' }} />}
            {isVideo && <VideoLibraryIcon style={{ fontSize: 64, color: '#4A5568' }} />}
            {(isPdf || (!isAudio && !isVideo)) && <InsertDriveFileIcon style={{ fontSize: 64, color: '#4A5568' }} />}
          </div>
        )}
      </div>
      
      <div className="px-4 py-2 bg-white">
        <Typography variant="subtitle2" className="font-medium truncate">
          {attachment.name}
        </Typography>
        <Typography variant="caption" className="text-gray-500">
          {(attachment.size / 1024 / 1024).toFixed(2)} MB
        </Typography>
      </div>
    </div>
  );
};

export default AttachmentPreview;