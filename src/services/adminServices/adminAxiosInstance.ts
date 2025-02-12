import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from './adminService'; 

const adminAxiosInstance = axios.create({
  // baseURL: 'http://localhost:3001/api/admin/',
  baseURL: 'http://localhost:8000/api/admin/',
  withCredentials: true,
});

adminAxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('AdminAccessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const fullUrl = `${config.baseURL || ''}${config.url}`;
    console.log('Making request to:', fullUrl);
    console.log('Request method:', config.method);
    console.log('Request headers:', config.headers);
    console.log('Request body:', config.data);
    
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

adminAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('error.response', error.response);
    console.log('error.response.status', error.response?.status);

    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('AdminRefreshToken');
      if (refreshToken) {
        try {
          const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
          Cookies.set('AdminAccessToken', accessToken, { expires: 1 / 96 }); // 15 minutes
          Cookies.set('AdminRefreshToken', newRefreshToken, { expires: 7 }); // 7 days
          adminAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return adminAxiosInstance(originalRequest);
        } catch (refreshError) {
          Cookies.remove('AdminAccessToken');
          Cookies.remove('AdminRefreshToken');
          // Note: You can't use useNavigate here. Instead, you should handle navigation in a React component.
          // For now, we'll just log out and reject the promise.
          console.log('Failed to refresh token. Admin needs to log in again.');
          return Promise.reject(refreshError);
        }
      } else {
        Cookies.remove('AdminAccessToken');
        Cookies.remove('AdminRefreshToken');
        console.log('No refresh token found. Admin needs to log in again.');
      }
    }
    return Promise.reject(error);
  }
);

export default adminAxiosInstance;