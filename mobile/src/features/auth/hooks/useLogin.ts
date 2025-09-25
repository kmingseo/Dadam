import { useDebugValue, useState } from 'react';
import { loginApi } from '../api/authApi';
import type { LoginRequest } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../shared/store/authSlice';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(data);
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      dispatch(loginSuccess(accessToken));

      return res;
    } catch (e: any) {
      setError(e.response?.data?.message || '로그인 실패');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}