import { AdminLoginPayload, AdminLoginResponse } from '../../interfaces/adminInterfaces/adminInterface';
import { RefreshTokenResponse } from '@/src/interfaces/userInterfaces/apiInterfaces';
import adminAxiosInstance from './adminAxiosInstance'


export const adminLogin = async (loginDetails: AdminLoginPayload): Promise<AdminLoginResponse> => {
  try {
    console.log("Service", loginDetails);
    const response = await adminAxiosInstance.post<AdminLoginResponse>(`login`, loginDetails);
    console.log("Service response", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to login' };
  }
};

export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
  const response = await adminAxiosInstance.post<RefreshTokenResponse>(`refresh-token`, { refreshToken });
  return response.data;
  }  catch (error: any) {
    throw error.response?.data || { message: 'Unknown error occured' };
  }
};
