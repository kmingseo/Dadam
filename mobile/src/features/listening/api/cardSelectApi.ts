import api from '../../../shared/api';
import { CardProblem, CardSelectRequest } from '../types';

export async function getProblemSetId(){
  try {
    const response = await api.get('/listening/card/start');
    return response.data;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
}

export async function getProblem({ problemSetId, problemIndex }: CardProblem){
    const response = await api.get('/listening/card/problem',{
        params:{
            problemSetId,
            problemIndex
        }
    });
    return response.data;
}

export async function checkAnswer(data: CardSelectRequest) {
  const response = await api.post('/listening/card/submit', data);
  return response.data;
}

