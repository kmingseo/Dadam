import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../../shared/store/authSlice';
import { logoutApi } from '../api/authApi';

export function useLogout() {
  const dispatch = useDispatch();

  const logout = async () => {
    try{
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if(refreshToken){
        await logoutApi(refreshToken);
      }
    } catch (err) {
      console.error('로그아웃 실패', err);
    } finally{
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    dispatch(logoutSuccess()); 
    }

  };

  return { logout };
}
