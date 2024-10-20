import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from './api';
import { useNavigate } from 'react-router-dom';

const axiosInstanceChat = axios.create({
  baseURL: 'http://localhost:5001/chat/',
});

axiosInstanceChat.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('UserAccessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axiosInstanceChat.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('UserRefreshToken');
      if (refreshToken) {
        try {
          const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
          Cookies.set('UserAccessToken', accessToken, { expires: 1 / 96 }); // 15 minutes
          Cookies.set('UserRefreshToken', newRefreshToken, { expires: 7 }); // 7 days
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstanceChat(originalRequest);
        } catch (refreshError) {
          Cookies.remove('UserAccessToken');
          Cookies.remove('UserRefreshToken');
          const navigate = useNavigate();
          navigate('/login');
          return Promise.reject(refreshError);
        }
      } else {
        Cookies.remove('UserAccessToken');
        Cookies.remove('UserRefreshToken');
        const navigate = useNavigate();
        navigate('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceChat;
