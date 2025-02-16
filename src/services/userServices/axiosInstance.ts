// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { refreshAccessToken } from './api';
// // import { logout } from '../../../src/Slices/userSlice/userSlice';
// import { logout } from '../../../src/Slices/userSlice/userSlice';
// import { store } from '../../../src/store';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:3001/api/',
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = Cookies.get('UserAccessToken');
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     const fullUrl = `${config.baseURL || ''}${config.url}`;
//     console.log('Making request to:', fullUrl);
//     console.log('Request method:', config.method);
//     console.log('Request headers:', config.headers);
//     console.log('Request body:', config.data);
    
//     return config;
//   },
//   (error) => {
//     console.log(error);
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     console.log('error.response', error.response);
//     console.log('error.response.status', error.response?.status);

//     const originalRequest = error.config;
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = Cookies.get('UserRefreshToken');
//       if (refreshToken) {
//         try {
//           const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
//           Cookies.set('UserAccessToken', accessToken, { expires: 1 / 96 }); // 15 minutes
//           Cookies.set('UserRefreshToken', newRefreshToken, { expires: 7 }); // 7 days
//           axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//           return axiosInstance(originalRequest);
//         } catch (refreshError) {
//           Cookies.remove('UserAccessToken');
//           Cookies.remove('UserRefreshToken');
//           // Note: You can't use useNavigate here. Instead, you should handle navigation in a React component.
//           // For now, we'll just log out and reject the promise.
//           console.log('Failed to refresh token. User needs to log in again.');
//           store.dispatch(logout());
//           // logout()
//           return Promise.reject(refreshError);
//         }
//       } else {
//         Cookies.remove('UserAccessToken');
//         Cookies.remove('UserRefreshToken');
//         console.log('No refresh token found. User needs to log in again.');
//         store.dispatch(logout());
//         // logout()
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from './api';
import { logout } from '../../../src/Slices/userSlice/userSlice';
import { store } from '../../../src/store';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:3001/api/',
//   withCredentials: true,
// });

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  // baseURL: 'https://xoxgaming.shop/api/',
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('UserAccessToken');
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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('error.response', error.response);
    console.log('error.response.status', error.response?.status);

    const originalRequest = error.config;
    
    // Check for blocked user scenario
    if (error.response && error.response.status === 401) {
      const blockedUserMessage = error.response.data?.message;
      
      // Specific handling for blocked user
      if (blockedUserMessage === 'User is blocked') {
        // Remove tokens
        Cookies.remove('UserAccessToken');
        Cookies.remove('UserRefreshToken');
        
        // Dispatch logout action
        store.dispatch(logout());
        
        // Optional: You can add a toast or alert to inform the user
        console.log('User is blocked. Logging out automatically.');
        
        return Promise.reject(error);
      }
      
      // Existing token refresh logic
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = Cookies.get('UserRefreshToken');
        if (refreshToken) {
          try {
            const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
            Cookies.set('UserAccessToken', accessToken, { expires: 1 / 96 }); // 15 minutes
            Cookies.set('UserRefreshToken', newRefreshToken, { expires: 7 }); // 7 days
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            Cookies.remove('UserAccessToken');
            Cookies.remove('UserRefreshToken');
            console.log('Failed to refresh token. User needs to log in again.');
            store.dispatch(logout());
            return Promise.reject(refreshError);
          }
        } else {
          Cookies.remove('UserAccessToken');
          Cookies.remove('UserRefreshToken');
          console.log('No refresh token found. User needs to log in again.');
          store.dispatch(logout());
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;