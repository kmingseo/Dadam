import { useState } from "react";
import { getWordTts } from "../api/cardSelectApi";
import Sound from "react-native-sound";
import RNFS from "react-native-fs";

export function useTts(){
    const [error, setError] = useState<string | null>(null);

    const sanitize = (text: string) => text.replace(/[^a-zA-Z0-9가-힣]/g, '_');

    const getVoice = async (text: string) => {
    try{
        setError(null);
        const safeText = sanitize(text);
        const path = `${RNFS.DocumentDirectoryPath}/tts_${safeText}.mp3`;
        const exists = await RNFS.exists(path);

        if (!exists) {
            const base64 = await getWordTts(text);
             await RNFS.writeFile(path, base64, 'base64');
        }

        const sound = new Sound(path,'',(error)=>{
            if(error) {
                setError('음성 재생 실패');
                return;
            }
            sound.play(()=>{
                sound.release();
            })
        })
        } catch(e:any){
            setError(e.response?.data?.message || '음성 불러오기 실패');
            throw e;
        }
    }

    const deleteTtsFile = async (text: string) => {
        const safeText = sanitize(text);
        const path = `${RNFS.DocumentDirectoryPath}/tts_${safeText}.mp3`;
        const exists = await RNFS.exists(path);
        if (exists){
            await RNFS.unlink(path);
        }
    }

    return { getVoice, deleteTtsFile, error};
}
