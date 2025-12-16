// ConsonantVowelScene.tsx (UI 요소를 수직 중앙으로 올림)

import React, { useMemo } from 'react';
import {
    View,
    Button,
    Text,
    SafeAreaView,
    StyleSheet,
    Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// ⚠️ SpeakingStackParamList 경로 확인 필수
import { SpeakingStackParamList } from '/Users/m1/Desktop/Dadam/mobile/src/navigation/SpeakingStack.tsx';
import SpeakingEvaluator, { WordType } from './SpeakingEvaluator';

// 🔑 Props 타입 정의
type Props = NativeStackScreenProps<SpeakingStackParamList, 'ConsonantVowelScene'>;

// ⭐️ 자음/모음 학습을 위한 더미 데이터 (예시)
const CONSONANT_VOWEL_DATA: WordType[] = [
    { id: 1, targetWord: 'ㄱ', imageUrl: '', languageCode: 'ko' },
    { id: 2, targetWord: 'ㄴ', imageUrl: '', languageCode: 'ko' },
    // ... 더 많은 자음/모음 데이터
];

export default function ConsonantVowelScene({ route, navigation }: Props) {
    const { initialLanguage } = route.params;

    const currentUnitData = useMemo(() => {
        // initialLanguage를 사용해 필터링 (현재는 한국어만 지원한다고 가정)
        return CONSONANT_VOWEL_DATA.find(data => data.languageCode === initialLanguage) || CONSONANT_VOWEL_DATA[0];
    }, [initialLanguage]);


    const handleNextUnit = () => {
        Alert.alert(
            '다음 단계',
            '다음 자음/모음으로 이동하는 로직 구현 필요',
            [{ text: '확인' }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button
                    title="← 뒤로가기"
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.headerText}>자음/모음 학습 ({initialLanguage.toUpperCase()})</Text>
            </View>

            <View style={styles.content}>
                <SpeakingEvaluator
                    type="consonant"
                    currentWord={currentUnitData}
                    onNext={handleNextUnit}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // 배경색: 밝은 노란색 유지
        backgroundColor: '#FFFACD',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#FFC107',
        // 헤더 배경: 진한 노란색 유지
        backgroundColor: '#FFEB3B',
    },
    headerText: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        // ✅ 수직 중앙 정렬 (가장 위로 올리지 않고, 헤더 아래 공간의 중앙에 배치)
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        // ❌ 이전에 UI를 아래로 내리기 위해 사용했던 paddingTop: '30%' 를 완전히 제거했습니다.
    },
});