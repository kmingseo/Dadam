import api from "../../../shared/api";
import { Dictation, DictationRequest } from "../types";

export async function getProblemSetId () {
    try{
        const response = await api.get('/listening/dictation/start');
        return response.data;
    } catch (err) {
        console.log('API 요청 실패', err);
        throw err;
    }
}

export async function getProblem({ problemSetId, problemIndex}: Dictation){
    const response = await api.get('/listening/dictation/problem',{
        params:{
            problemSetId,
            problemIndex
        }
    });
    return response.data;
}

export async function checkAnswer (data: DictationRequest){

    const response = await api.post('/listening/dictation/submit', data);

    return response.data;
}
