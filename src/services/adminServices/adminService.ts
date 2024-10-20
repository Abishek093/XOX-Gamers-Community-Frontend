import axios from 'axios';
import {AdminLoginPayload, AdminLoginResponse} from '../../interfaces/adminInterfaces/adminInterface';

const API_URL = 'http://localhost:3000/admin/';



export const adminLogin = async (loginDetails: AdminLoginPayload): Promise<AdminLoginResponse> => {
    try {
      console.log("Service",loginDetails);
      const response = await axios.post<AdminLoginResponse>(`${API_URL}login`, loginDetails);
      console.log("Service response",response.data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to login' };
    }
  };