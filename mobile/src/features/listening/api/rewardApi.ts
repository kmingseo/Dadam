import api from "../../../shared/api";

export async function requestReward(coin: number) {
    try{
        const res = await api.post('/auth/reward', {
            coin: coin
        });
        return res.data;
    }catch(e){
        console.log('API 요청 실패', e);
        throw e;
    }
}