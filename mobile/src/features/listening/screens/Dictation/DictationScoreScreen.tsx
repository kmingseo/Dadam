import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ListeningStackParamList } from '../../../../navigation/types';
import { useListeningNavigation } from '../../../../navigation/useAppNavigation';
import { useEffect } from 'react';
import {useReward} from '../../hooks/useReward';

type DictationProbRouteProp = RouteProp<ListeningStackParamList, 'DictationScore'>;

export default function DictationScoreScreen() {
    const navigation = useListeningNavigation();
    const route = useRoute<DictationProbRouteProp>();
    const {score} = route.params;
    const { getReward } = useReward();

    useEffect(()=>{
        const reward = async () => {
            await getReward(score);
        }
        reward();
    },[score])

    const handleMain = () => {
        navigation.reset({
        index: 0,
        routes: [{ name: 'ListeningHome' }],
        });
    }

    return (
        <View>
            <Text>받아쓰기 점수</Text>
            <Text>{score}</Text>
            <TouchableOpacity onPress={handleMain}>
                <Text>돌아가기</Text>
            </TouchableOpacity>
        </View>
    )
}