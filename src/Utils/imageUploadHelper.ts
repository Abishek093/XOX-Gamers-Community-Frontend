// import axiosInstance from '../services/userServices/axiosInstance';
// const BACKEND_API_URL = import.meta.env.VITE_USER_API_URL;


// export const getPresignedUrl = async (userId: string, fileType: string): Promise<{ uploadUrl: string, key: string }> => {
//   try {
//     const response = await axiosInstance.post(`${BACKEND_API_URL}upload-url`, {
//       userId,
//       fileType,
//     });
//     console.log("Presigned url",response.data)
//     return response.data; 
//   } catch (error) {
//     console.error("Failed to get pre-signed URL", error);
//     throw new Error('Could not get pre-signed URL');
//   }
// };

// export const uploadImageToS3 = async (uploadUrl: string, imageBlob: Blob): Promise<void> => {
//   try {
//     const response = await axiosInstance.put(uploadUrl, imageBlob, {
//       headers: {
//         'Content-Type': imageBlob.type, 
//       },
//     });
    
//     if (response.status !== 200) {
//       throw new Error('Failed to upload image to S3');
//     }
//   } catch (error) {
//     console.error("Failed to upload image to S3", error);
//     throw new Error('Image upload to S3 failed');
//   }
// };

// // Utility to convert base64 image string to Blob
// export const base64ToBlob = (base64Image: string, contentType: string): Blob => {
//   const byteString = window.atob(base64Image);
//   const arrayBuffer = new ArrayBuffer(byteString.length);
//   const uintArray = new Uint8Array(arrayBuffer);

//   for (let i = 0; i < byteString.length; i++) {
//     uintArray[i] = byteString.charCodeAt(i);
//   }

//   return new Blob([arrayBuffer], { type: contentType });
// };




// import axios from 'axios';
// import axiosInstance from '../services/userServices/axiosInstance';
// const BACKEND_API_URL = import.meta.env.VITE_USER_API_URL;

// export const getPresignedUrl = async (userId: string, fileType: string): Promise<{ uploadUrl: string, key: string }> => {
//   try {
//     console.log("Requesting pre-signed URL...");
//     const response = await axiosInstance.post(`${BACKEND_API_URL}upload-url`, {
//       userId,
//       fileType,
//     });
    
//     // Log pre-signed URL response
//     console.log("Pre-signed URL response:", response.data);
//     return response.data; 
//   } catch (error) {
//     console.error("Failed to get pre-signed URL", error);
//     throw new Error('Could not get pre-signed URL');
//   }
// };

// export const uploadImageToS3 = async (uploadUrl: string, imageBlob: Blob): Promise<void> => {
//   try {
//     console.log("Uploading image to S3...");
//     console.log("Upload URL:", uploadUrl);
//     console.log("Blob Details:", { size: imageBlob.size, type: imageBlob.type });

//     const response = await axios.put(uploadUrl, imageBlob, {
//       headers: {
//         'Content-Type': imageBlob.type || 'image/jpeg',
//       },
//     });

//     console.log("S3 Upload Response Status:", response.status);

//     if (response.status !== 200) {
//       console.error("S3 upload failed with status:", response.status);
//       throw new Error('Failed to upload image to S3');
//     }

//     console.log("Image uploaded to S3 successfully");
//   } catch (error) {
//     console.error("Failed to upload image to S3", error);
//     throw new Error('Image upload to S3 failed');
//   }
// };

// // Utility to convert base64 image string to Blob with Debugging
// export const base64ToBlob = (base64Image: string, contentType: string): Blob => {
//   try {
//     const byteString = window.atob(base64Image);
//     const arrayBuffer = new ArrayBuffer(byteString.length);
//     const uintArray = new Uint8Array(arrayBuffer);

//     for (let i = 0; i < byteString.length; i++) {
//       uintArray[i] = byteString.charCodeAt(i);
//     }

//     console.log('Blob created successfully:', { contentType, size: uintArray.length });
//     return new Blob([arrayBuffer], { type: contentType });
//   } catch (error) {
//     console.error('Failed to convert base64 to Blob', error);
//     throw error;
//   }
// };







import axios from 'axios';
import axiosInstance from '../services/userServices/axiosInstance';

// export const getPresignedUrl = async (
//   userId: string, 
//   fileType: string, 
//   apiUrl: string 
// ): Promise<{ uploadUrl: string, key: string }> => {
//   try {
//     console.log("Requesting pre-signed URL...",`${apiUrl}/upload-url`);

//     const response = await axiosInstance.post(`${apiUrl}/upload-url`, {
//       userId,
//       fileType,
//     });
    
//     console.log("Pre-signed URL response:", response.data);
//     return response.data; 
//   } catch (error) {
//     console.error("Failed to get pre-signed URL", error);
//     throw new Error('Could not get pre-signed URL');
//   }
// };
export const getPresignedUrl = async (userId: string, fileType: string, apiUrl: string): Promise<{ uploadUrl: string, key: string }> => {
  try {
    console.log("Frontend: Requesting pre-signed URL...", `${apiUrl}upload-url`);
    console.log("Frontend: Request payload:", { userId, fileType });

    const response = await axiosInstance.post(`${apiUrl}upload-url`, {
      userId,
      fileType,
    });
    
    console.log("Frontend: Pre-signed URL response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Frontend: Failed to get pre-signed URL", error);
    throw new Error('Could not get pre-signed URL');
  }
};

export const uploadImageToS3 = async (uploadUrl: string, imageBlob: Blob): Promise<void> => {
  try {
    console.log("Uploading image to S3...");
    const response = await axios.put(uploadUrl, imageBlob, {
      headers: {
        'Content-Type': imageBlob.type || 'image/jpeg',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to upload image to S3');
    }

    console.log("Image uploaded to S3 successfully");
  } catch (error) {
    console.error("Failed to upload image to S3", error);
    throw new Error('Image upload to S3 failed');
  }
};

export const base64ToBlob = (base64Image: string, contentType: string): Blob => {
  try {
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: contentType });
  } catch (error) {
    console.error('Failed to convert base64 to Blob', error);
    throw error;
  }
};
