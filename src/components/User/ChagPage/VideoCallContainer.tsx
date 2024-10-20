import React, { useEffect } from 'react';

interface VideoCallContainerProps {
  roomID: string;
}

const VideoCallContainer: React.FC<VideoCallContainerProps> = ({ roomID }) => {
  useEffect(() => {
    // This function initializes the Zego video call interface in the container
    const initVideoCall = () => {
      const container = document.getElementById("video-call-container");
      if (container) {
        // You can reuse your `startVideoCall` method here if necessary
        // It would also handle joining the video room and rendering the video interface
      }
    };

    initVideoCall();
  }, [roomID]);

  return <div id="video-call-container" style={{ width: '100%', height: '100%' }} />;
};

export default VideoCallContainer;
