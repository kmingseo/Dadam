import axios from 'axios';
import { REACT_APP_SPRING_API } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './store';
import { logoutSuccess } from './store/authSlice';

const api = axios.create({
  baseURL: REACT_APP_SPRING_API,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    //401 에러
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) { //refreshToken X -> 로그아웃
          store.dispatch(logoutSuccess());
          throw new Error('No refresh token');
        }

        //재발급
        const response = await api.post('/auth/refresh', { refreshToken });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        await AsyncStorage.setItem('accessToken', newAccessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        //재요청
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) { //refresh 에러 발생
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        store.dispatch(logoutSuccess());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;