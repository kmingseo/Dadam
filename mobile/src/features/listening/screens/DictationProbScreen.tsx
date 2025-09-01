import { Text, Touchable, TouchableOpacity, View } from "react-native";
import { useListeningNavigation } from "../../../navigation/useAppNavigation";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ListeningStackParamList } from "../../../navigation/types";
import { useDictaionProb } from "../hooks/useDicationProb";
import { useTts } from "../hooks/useTts";
import { useEffect, useState } from "react";

type DictationProbRouteProp = RouteProp<ListeningStackParamList, 'DictationProb'>;

export default function DictationProbScreen () {
    const navigation = useListeningNavigation();
    const route = useRoute<DictationProbRouteProp>();
    const {getDictaionProb, loading, error} = useDictaionProb();
    const {getVoice, deleteTtsFile} = useTts();
    const {problemSetId} = route.params;

    const [problemIndex, setProblemIndex] = useState(0);
    const [sentence, setSentence] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(()=>{
        const loadProblem = async () => {
            setIsSubmitted(false);
            const prob = await getDictaionProb({problemSetId, problemIndex});
            setSentence(prob.body);
        }
        loadProblem();
    },[problemIndex])

    const handleNext = async () =>{
        if(sentence !== null ){
            await deleteTtsFile(sentence);
        }
        if(problemIndex>=4) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'ListeningHome'}]
            })
        }
        else setProblemIndex((prev)=>prev+1);
    }

    const handleSubmit = async () => {
        setIsSubmitted(true);
    }

    const handleVoice = async () => {
        if(sentence!== null) {
            getVoice(sentence);
        }
    }

    return(
        <View>
            <Text>잘 듣고 받아 적기</Text>
            {!isSubmitted && (
                <>
                <TouchableOpacity onPress={handleVoice}>
                    <Text>음성 듣기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit}>
                    <Text>정답 제출</Text>
                </TouchableOpacity>
                </>
            )}
            {isSubmitted && (
                <TouchableOpacity onPress={handleNext}>
                    <Text>다음</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}