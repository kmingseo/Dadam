import { useState } from "react";
import { getProblem, getProblemSetId } from "../api/dictationApi";
import { Dictation } from "../types";


export function useDictaionProb(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dictationStart = async () => {
        setLoading(true);
        setError(null);
        try{
            const res = await getProblemSetId();
            return res;
        } catch (e:any){
            setError(e.response?.data?.message || '문제 생성 실패');
            throw e
        } finally {
            setLoading(false);
        }
    }

    const getDictaionProb = async (data: Dictation) => {
        setLoading(true);
        setError(null);
        try{
            const res = await getProblem(data);
            return res;
        } catch (e:any) {
            setError(e.response?.data?.message || '문제 불러오기 실패');
            throw e;
        } finally{
            setLoading(false);
        }
    }



    return {dictationStart, getDictaionProb, loading, error};
}