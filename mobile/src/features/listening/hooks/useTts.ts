import { useState } from "react";
import Sound from "react-native-sound";
import RNFS from "react-native-fs";
import { Card, DictationProb } from "../types";
import { getTts } from "../api/ttsApi";

type TtsTarget = Card | DictationProb;

export function useTts(){
    const [error, setError] = useState<string | null>(null);

    const getVoice = async (target: TtsTarget) => {
    try{
        setError(null);
        let id: number;
        let prefix:string;

        const isCard = "wordId" in target;

        if(isCard) {
            prefix = "Cardtts";
            id=target.wordId;
        } else{
            id = target.id;
            prefix = target.type === "word" ? "DictationWord" : "DictationSentence";
        }

        const path = `${RNFS.DocumentDirectoryPath}/${prefix}_${id}.mp3`;
        const exists = await RNFS.exists(path);

        if (!exists) {
            const base64 = await getTts(target.body);
            console.log(target.body);
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

    const deleteTtsFile = async (target: TtsTarget) => {
        
        const isCard = "wordId" in target;
        const id = isCard? target.wordId : target.id;
        const prefix = isCard? "Cardtts" : "Dictationtts";

        const path = `${RNFS.DocumentDirectoryPath}/${prefix}_${id}.mp3`;
        const exists = await RNFS.exists(path);
        if (exists){
            await RNFS.unlink(path);
        }
    }

    return { getVoice, deleteTtsFile, error};
}
