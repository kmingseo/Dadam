import api from "../../../shared/api";
import { Dictation } from "../types";

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
    const response = await api.get('/listening/dictaion/problem',{
        params:{
            problemSetId,
            problemIndex
        }
    });
    return response.data;
}
