import api from '../../../shared/api';
import { SignupRequest, LoginRequest } from '../types';

export async function signupApi(data: SignupRequest) {
  const response = await api.post('/auth/sign-up', data);
  return response.data;
}

export async function loginApi(data: LoginRequest){
    const response = await api.post('/auth/sign-in', data);
    return response.data;
}

export async function logoutApi(refreshToken: string){
  const response = await api.post('/auth/logout', {refreshToken});
  return response.data;
}
