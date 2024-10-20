import { UserData, UserApiData, VerifyOtpPayload, VerifyOtpResponse, LoginPayload, LoginResponse, GoogleUser, AuthenticatedUser, RefreshTokenResponse, UpdateUserResponse, UpdateUser, ConfirmMailRequest, ConfirmMailResponse, verifyResetOtpResponse, UpdatePasswordRequest, UpdatePasswordResponse, ImageUploadValues, ImageUploadResponse } from '../../interfaces/userInterfaces/apiInterfaces';
import axiosInstance from './axiosInstance';


const BACKEND_API_URL = import.meta.env.VITE_USER_API_URL;
const API_URL = import.meta.env.VITE_USER_SERVICE_API_URL;

export const signup = async (userDetails: UserApiData): Promise<UserData> => {
  try {
    const response = await axiosInstance.post<UserData>(`user/signup`, userDetails);
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.log("Api error",error);    
    console.log("Api error message",error.response.data);
    throw error.response?.data || { message: 'Failed to signup' };    
  }
};

export const verifyOtpApi = async (otpDetails: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
  try {
    const response = await axiosInstance.post<VerifyOtpResponse>(`user/verify-otp`, otpDetails);
    return response.data;
  } catch (error: any) {
    console.log("Error in verify otp",error);
    console.log("Error message in verify otp",error.response?.data);
    
    throw error.response?.data || { message: 'Failed to verify OTP' };
  }
};

export const login = async (loginDetails: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>(`user/login`, loginDetails);
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to login' };
  }
};

export const confirmMailApi = async (emailRequest: ConfirmMailRequest): Promise<ConfirmMailResponse> => {
  try {
    console.log(emailRequest, "in api");
    const response = await axiosInstance.post<ConfirmMailResponse>(`user/confirm-mail`, emailRequest);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to verify login' };
  }
};


export const googleAuthApi = async (googleAuthDetails: GoogleUser): Promise<AuthenticatedUser> => {
  try {
    console.log("googleAuthDetails api",googleAuthDetails)
    const response = await axiosInstance.post<AuthenticatedUser>(`user/googleAuth`,googleAuthDetails)
    console.log("Response",response, "Response.data", response.data);
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to login');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error(error.message || 'Failed to login');
    }
  }
};

export const updateUserApi = async (userId: string, updateDetails: UpdateUser): Promise<UpdateUserResponse> => {
  try {
    console.log(userId, updateDetails, "updateDetails");
    const response = await axiosInstance.patch<UpdateUserResponse>(`user/update-user/${userId}`, updateDetails);
    console.log(response);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update user');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error(error.message || 'Failed to update user');
    }
  }
};

export const verifyResetOtpApi = async (otpDetails: VerifyOtpPayload): Promise<verifyResetOtpResponse> => {
  try {
    const response = await axiosInstance.post<verifyResetOtpResponse>(`user/confirm-mail-otp`, otpDetails);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to verify OTP' };
  }
};

export const UpdatePasswordApi = async (newPasswordDeatails: UpdatePasswordRequest): Promise<UpdatePasswordResponse> => {
  try {
    const response = await axiosInstance.post<UpdatePasswordResponse>(`user/update-password`, newPasswordDeatails);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update password' };
  }
};

// export const updateProfieImageApi = async(profileImageDetails: ImageUploadValues):Promise<ImageUploadResponse>=>{
//   const response = await axiosInstance.post<ImageUploadResponse>(`${BACKEND_API_URL}update-profile-image`,profileImageDetails)
//   console.log(response, "in api")
//   return response.data
// }

export const updateProfileImageApi = async (userId: string, profileImageUrl: string): Promise<string> => {
  try {
    const response = await axiosInstance.post<{ profileImageUrl: string }>(
      `user/update-profile-image`,
      { userId, profileImageUrl }
    );
    
    console.log("Response from server:", response);
    return response.data.profileImageUrl; 
  } catch (error) {
    console.error("Failed to update profile image:", error);
    throw error;
  }
};




// export const updateTitleImageApi= async(titleImageDetails: ImageUploadValues):Promise<ImageUploadResponse>=>{
//   const response = await axiosInstance.post<ImageUploadResponse>(`${API_URL}update-title-image`,titleImageDetails)
//   console.log(response, "in api")
//   return response.data
// }
export const updateTitleImageApi = async (userId: string, titleImageUrl: string): Promise<string> => {
  try {
    const response = await axiosInstance.post<{ titleImageUrl: string }>(
      `user/update-title-image`,
      { userId, titleImageUrl }
    );

    console.log("Response from server:", response);
    return response.data.titleImageUrl; 
  } catch (error) {
    console.error("Failed to update title image:", error);
    throw error;
  }
};


export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.post<RefreshTokenResponse>(`user/refresh-token`, { refreshToken });
  return response.data;
};
