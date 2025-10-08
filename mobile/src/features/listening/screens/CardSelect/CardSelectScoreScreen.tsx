import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ListeningStackParamList } from '../../../../navigation/types';
import { useListeningNavigation } from '../../../../navigation/useAppNavigation';

type CardSelectProbRouteProp = RouteProp<ListeningStackParamList, 'CardSelectScore'>;

export default function CardSelectScoreScreen() {
    const navigation = useListeningNavigation();
    const route = useRoute<CardSelectProbRouteProp>();
    const {score} = route.params;

    const handleMain = () => {
        navigation.reset({
        index: 0,
        routes: [{ name: 'ListeningHome' }],
        });
    }

    return (
        <View>
            <Text>카드 고르기 점수</Text>
            <Text>{score}</Text>
            <TouchableOpacity onPress={handleMain}>
                <Text>돌아가기</Text>
            </TouchableOpacity>
        </View>
    )
}