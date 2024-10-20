// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// const APP_ID = Number(import.meta.env.VITE_APP_ID);
// const SERVER_SECRET = import.meta.env.VITE_SERVER_SECRET;


// export const generateKitToken = (roomID: string, userID: string, userName: string) => {
//   return ZegoUIKitPrebuilt.generateKitTokenForTest(APP_ID, SERVER_SECRET, roomID, userID, userName);
// };

// export const startVideoCall = (roomID: string, userID: string, userName: string) => {
//   const kitToken = generateKitToken(roomID, userID, userName);

//   const zp = ZegoUIKitPrebuilt.create(kitToken);
//   zp.joinRoom({
//     container: document.getElementById("video-call-container"),
//     scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
//   });
// };
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const APP_ID = Number(import.meta.env.VITE_APP_ID);
const SERVER_SECRET = import.meta.env.VITE_SERVER_SECRET;

export const generateKitToken = (roomID: string, userID: string, userName: string) => {
  return ZegoUIKitPrebuilt.generateKitTokenForTest(APP_ID, SERVER_SECRET, roomID, userID, userName);
};

export const startVideoCall = async (roomID: string, userID: string, userName: string) => {
  try {
    const kitToken = generateKitToken(roomID, userID, userName);
    
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    
    await zp.joinRoom({
      container: document.getElementById("video-call-container"),
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
    });
    
    console.log('Joined room successfully');
  } catch (error) {
    console.error('Error starting video call:', error);
  }
};
