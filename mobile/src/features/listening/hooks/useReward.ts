import { useState } from "react"
import { requestReward } from "../api/rewardApi";


export function useReward(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getReward = async( score: number) => {
        setLoading(true);
        setError(null);
        try{
            const coin = score*10;
            const res = await requestReward(coin);
            return res;
        } catch(e:any){
            setError(e.reponse?.data?.message||'보상 획득 실패');
            throw e;
        } finally{
            setLoading(false);
        }
    }

    return {getReward, loading, error};
}