import React from 'react';
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useNavigate } from 'react-router-dom';

const VideoCall: React.FC = () => {
    // const appID = 380960759;
    // const serverSecret = "1e0313f37de2d4b92ffe7e437802abee";
    const { userId } = useParams<{ userId: string }>();  // useParams to get userId from route params
    const navigate = useNavigate();
    
    // Provide a fallback if userId is undefined
    if (!userId) {
        console.error("User ID is undefined. Redirecting...");
        navigate("/error");  // Optionally navigate to an error page
        return null;
    }

    // const userName = 'flgnlfkglkfs'; // You can use a dynamic value here as well
    // const roomID  = 'kjfdshgjk';  // This can also be dynamic
    // const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userName);

    return (
        <div>

        </div>
    );
}

export default VideoCall;
