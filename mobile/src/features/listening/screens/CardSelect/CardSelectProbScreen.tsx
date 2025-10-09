import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useListeningNavigation } from '../../../../navigation/useAppNavigation';
import { useCardProb } from '../../hooks/useCardProb';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ListeningStackParamList } from '../../../../navigation/types';
import { useEffect, useState } from 'react';
import { Card } from '../../types';
import { useTts } from '../../hooks/useTts';

type CardSelectProbRouteProp = RouteProp<ListeningStackParamList, 'CardSelectProb'>;

export default function CardSelectProbScreen() {
    const navigation = useListeningNavigation();
    const route = useRoute<CardSelectProbRouteProp>(); 
    const {submit, getCardProb, loading, error} = useCardProb(); 
    const {getVoice, deleteTtsFile} = useTts();
    const {problemSetId} = route.params;

    const [problemIndex, setProblemIndex] = useState(0);
    const [answerIndex, setAnswerIndex] = useState(-1);
    const [selectedCardIndex , setSelectedCardIndex] = useState<number | null> (null);
    const [score, setScore] = useState(0);
    const [cards, setCards] = useState<Card[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);


    useEffect(()=>{
        const loadProblem = async () => {
            setIsSubmitted(false);
            setSelectedCardIndex(null);
            const prob = await getCardProb({problemSetId, problemIndex});
            setCards(prob.cards);
            setAnswerIndex(prob.answerIndex);
        }
        loadProblem();
    },[problemIndex]);

    const handleSubmit = async () =>{
        if(selectedCardIndex===null){
            Alert.alert('정답 카드를 선택하세요');
            return;
        }
        const answer = { problemSetId, problemIndex, selectedCardIndex };
        
        const res = await submit(answer);
        if(res) setScore((prev)=>prev+1);
        setIsSubmitted(true);
    }

    const handleNext = async () => {
        if(answerIndex !== -1){
            await deleteTtsFile(cards[answerIndex]);
        }
        if(problemIndex >= 4) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'CardSelectScore', params: { score } }],
            });
        }
        else setProblemIndex((prev)=>prev + 1);
    }

    const handleVoice = async () => {
        if(answerIndex !== -1) {
            getVoice(cards[answerIndex]);
        }
    }
    
    
  return (
    <View>
        <Text>음성을 듣고 적절한 카드를 골라보세요</Text>
        {cards.map((card, index) => {
            const isCorrect = isSubmitted && index === answerIndex;
            const isWrong = isSubmitted && index === selectedCardIndex && selectedCardIndex !== answerIndex;
         return (
            <TouchableOpacity
                key={index}
                onPress={() => setSelectedCardIndex(index)}
                disabled={isSubmitted}
                style={[
                    styles.cardButton,
                    selectedCardIndex === index && !isSubmitted && styles.cardButtonSelected,
                    isCorrect && styles.cardCorrect,
                    isWrong && styles.cardIncorrect,
                    isSubmitted && styles.cardButtonDisabled,
                ]}
            >
            <Text>{card.body}</Text>
            {isSubmitted && card.translatedBody && (
                <Text>{card.translatedBody}</Text>
            )}
            </TouchableOpacity>
            );
        })}
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
  );
}

const styles = StyleSheet.create({
    cardButton: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 8,
        borderRadius: 8,
    },
    cardButtonSelected: {
        borderColor: '#000',
        backgroundColor: '#ddd',
    },
    cardButtonDisabled: {
        opacity: 0.6,
    },
    cardCorrect: {
        backgroundColor: 'lightgreen',
        borderColor: 'green',
    },
    cardIncorrect: {
        backgroundColor: '#f8d7da',
        borderColor: '#dc3545',
    },
});
