import { useState } from "react";
import { checkAnswer, getProblem, getProblemSetId } from "../api/cardSelectApi";
import { CardProblem, CardSelectRequest } from "../types";

export function useCardProb(){
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

    const cardSelectStart = async () => {
        setLoading(true);
        setError(null);
        try{
            const res = await getProblemSetId();
            return res;
        } catch (e:any){
            setError(e.response?.data?.message || '문제 생성 실패');
            throw e;
        } finally{
            setLoading(false);
        }
    };

    const getCardProb = async (data: CardProblem) => {
        setLoading(true);
        setError(null);
        try{
            const res = await getProblem(data);
            return res;
        } catch (e:any){
            setError(e.response?.data?.message || '문제 불러오기 실패');
            throw e;
        } finally{
            setLoading(false);
        }
    }

    const submit = async (data: CardSelectRequest) => {
        setLoading(true);
        setError(null);
        try{
            const res = await checkAnswer(data);
            return res;
        } catch(e:any){
            setError(e.response?.data?.message || '답 확인 실패')
        } finally{
            setLoading(false);
        }
    }

    return {cardSelectStart, getCardProb, submit, loading, error};
}