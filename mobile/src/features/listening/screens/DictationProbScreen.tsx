import { Text, TouchableOpacity, View, Platform, StyleSheet } from "react-native";
import { useListeningNavigation } from "../../../navigation/useAppNavigation";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ListeningStackParamList } from "../../../navigation/types";
import { useDictaionProb } from "../hooks/useDicationProb";
import { useTts } from "../hooks/useTts";
import { useEffect, useState } from "react";
import { DictationRequest, Sentence } from "../types";
import Signature from 'react-native-signature-canvas';
import { useRef } from "react";

type DictationProbRouteProp = RouteProp<ListeningStackParamList, 'DictationProb'>;

export default function DictationProbScreen () {
    const navigation = useListeningNavigation();
    const route = useRoute<DictationProbRouteProp>();
    const {getDictaionProb, submit, loading, error} = useDictaionProb();
    const {getVoice, deleteTtsFile} = useTts();
    const {problemSetId} = route.params;
    const signRef = useRef<any>(null);

    const [score, setScore] = useState(0);    
    const [problemIndex, setProblemIndex] = useState(0);
    const [sentence, setSentence] = useState<Sentence | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userAnswer, setUserAnswer] = useState(null);

    useEffect(()=>{
        const loadProblem = async () => {
            setIsSubmitted(false);
            const prob = await getDictaionProb({problemSetId, problemIndex});
            setSentence(prob);
        }
        loadProblem();
    },[problemIndex])

    const handleNext = async () =>{
        if(signRef.current){
        signRef.current.clearSignature();
        }
        if(sentence !== null ){
            await deleteTtsFile(sentence);
        }
        if(problemIndex>=4) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'DictationScore', params: { score } }],
            })
        }
        else setProblemIndex((prev)=>prev+1);
    }

    const handleSubmit = async () => {
        signRef.current?.readSignature();
    }

    const onOK = async (dataURL: string) => {
        try {
            const m = dataURL.match(/^data:image\/.+;base64,(.*)$/);
            if(!m) throw new Error('유효하지 않은 dataURL');
            const base64 = m[1];
            const data: DictationRequest = {
                imageBase64: base64,
                problemSetId,
                problemIndex
            };

            const res = await submit(data);
                
            if(res.correct) setScore((prev)=>prev+1);
            setUserAnswer(res.userAnswer);
            setIsSubmitted(true);
        } catch (err) {
            console.error('제출 실패', err);
        }
    }

     const handleClear = () => signRef.current?.clearSignature();
    
    const handleVoice = async () => {
        if(sentence!== null) {
            getVoice(sentence);
        }
    }

 return (
    <View style={styles.container}>
      <Text style={styles.title}>잘 듣고 받아 적기</Text>
      <View style={styles.canvasWrapper}>
        <Signature
          ref={signRef}
          onOK={onOK}
          onEmpty={() => {}}
          autoClear={false}
          penColor="black"
          backgroundColor="white"
          style={styles.signature}
          webStyle=".m-signature-pad--footer { display: none; height: 0 !important; }"
        />
      </View>

        {!isSubmitted && (
            <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.button} onPress={handleVoice}>
                    <Text>음성 듣기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleClear}>
                    <Text>지우기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text>정답 제출</Text>
                </TouchableOpacity>
            </View>
        )}

        {isSubmitted && (
            <View>
                <View style={{marginBottom: 8}}>
                    <Text>사용자 답안: {userAnswer}</Text>
                </View>
                <View style={{marginBottom: 8}}>
                    <Text>답: {sentence?.body}</Text>
                    {isSubmitted && sentence?.translatedBody && (
                        <Text>{sentence?.translatedBody}</Text>
                    )}
                </View>
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text>다음</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 12 },
  canvasWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 400,
    marginBottom: 16,
  },
  signature: { flex: 1 },
  buttonWrapper: { flexDirection: "row", justifyContent: "space-around" },
  button: { padding: 12, backgroundColor: "#eee", borderRadius: 6 },
});