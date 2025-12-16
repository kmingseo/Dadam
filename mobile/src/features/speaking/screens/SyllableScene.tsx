// SyllableScene.tsx (최종 수정 - 한국어 음절 학습 로직 추가)

import React, { useState, useMemo } from 'react';
import {
    View,
    Button,
    Text,
    SafeAreaView,
    StyleSheet,
    Alert,
    ActivityIndicator // 로딩 상태 처리(선택적)
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// ⚠️ SpeakingStackParamList 경로 확인 필수
import { SpeakingStackParamList } from '/Users/m1/Desktop/Dadam/mobile/src/navigation/SpeakingStack.tsx';
import SpeakingEvaluator, { WordType } from './SpeakingEvaluator';

// 🔑 Props 타입 정의
type Props = NativeStackScreenProps<SpeakingStackParamList, 'SyllableScene'>;

// ⭐️ ⭐️ ⭐️ 한국어 음절 학습을 위한 확장된 데이터 (WordType 형식) ⭐️ ⭐️ ⭐️
// 한국어는 initialLanguage가 'ko'일 때만 데이터를 사용한다고 가정합니다.
const SYLLABLE_DATA_KO: WordType[] = [
    // 가, 나, 다, 라, 마... 등 기본 음절
    { id: 1, targetWord: '가', imageUrl: '', languageCode: 'ko' },
    { id: 2, targetWord: '나', imageUrl: '', languageCode: 'ko' },
    { id: 3, targetWord: '다', imageUrl: '', languageCode: 'ko' },
    { id: 4, targetWord: '라', imageUrl: '', languageCode: 'ko' },
    { id: 5, targetWord: '마', imageUrl: '', languageCode: 'ko' },
    { id: 6, targetWord: '거', imageUrl: '', languageCode: 'ko' },
    { id: 7, targetWord: '너', imageUrl: '', languageCode: 'ko' },
    { id: 8, targetWord: '도', imageUrl: '', languageCode: 'ko' },
    { id: 9, targetWord: '로', imageUrl: '', languageCode: 'ko' },
    { id: 10, targetWord: '모', imageUrl: '', languageCode: 'ko' },
    // 필요하다면 더 많은 음절 추가
];


export default function SyllableScene({ route, navigation }: Props) {
    const { initialLanguage } = route.params;

    // ⭐️ 학습 인덱스를 관리하는 상태 추가
    const [currentIndex, setCurrentIndex] = useState(0);

    // 한국어 음절 데이터만 필터링 (현재는 'ko'만 지원)
    const filteredSyllables = useMemo(() => {
        if (initialLanguage === 'ko') {
            return SYLLABLE_DATA_KO;
        }
        // 다른 언어는 지원하지 않으므로 빈 배열 반환
        return [];
    }, [initialLanguage]);

    const currentUnitData = filteredSyllables[currentIndex] ?? null;


    const handleNextUnit = () => {
        if (currentIndex < filteredSyllables.length - 1) {
            // ⭐️ 다음 음절로 인덱스 증가
            setCurrentIndex(prev => prev + 1);
        } else {
            // 마지막 음절 학습 완료
            Alert.alert(
                '학습 완료',
                '한국어 음절 학습을 모두 완료했습니다.',
                [{ text: '홈으로', onPress: () => navigation.goBack() }]
            );
        }
    };

    // ⭐️ 데이터 로딩 또는 없음 상태 처리
    if (filteredSyllables.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Button title="← 뒤로가기" onPress={() => navigation.goBack()} />
                </View>
                <View style={styles.content}>
                    <Text>선택한 언어의 음절 목록이 없습니다.</Text>
                </View>
            </SafeAreaView>
        );
    }

    // ⭐️ 현재 유닛 데이터가 유효하지 않으면 (인덱스 오류 등)
    if (!currentUnitData) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {/* ⭐️ 뒤로가기 처리를 navigation.goBack()으로 단순화 */}
                <Button title="← 뒤로가기" onPress={() => navigation.goBack()} />
                <Text style={styles.headerText}>
                    음절 학습 (KO) | {currentIndex + 1} / {filteredSyllables.length}
                </Text>
            </View>

            <View style={styles.content}>
                <SpeakingEvaluator
                    type="syllable" // ⭐️ type은 "syllable"
                    currentWord={currentUnitData} // ⭐️ 현재 음절 데이터 전달
                    onNext={handleNextUnit} // ⭐️ 다음 단계 로직 전달
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        // marginLeft: 10, // justify-content: 'space-between' 사용 시 필요 없음
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});