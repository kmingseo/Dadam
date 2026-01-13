import React, { useState, useMemo } from 'react';
import {
    View,
    Button,
    Text,
    SafeAreaView,
    StyleSheet,
    Alert,
    ActivityIndicator 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SpeakingStackParamList } from '/Users/m1/Desktop/Dadam/mobile/src/navigation/SpeakingStack.tsx';
import SpeakingEvaluator, { WordType } from './SpeakingEvaluator';
type Props = NativeStackScreenProps<SpeakingStackParamList, 'SyllableScene'>;

const SYLLABLE_DATA_KO: WordType[] = [
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
];


export default function SyllableScene({ route, navigation }: Props) {
    const { initialLanguage } = route.params;

    const [currentIndex, setCurrentIndex] = useState(0);

    const filteredSyllables = useMemo(() => {
        if (initialLanguage === 'ko') {
            return SYLLABLE_DATA_KO;
        }
        return [];
    }, [initialLanguage]);

    const currentUnitData = filteredSyllables[currentIndex] ?? null;


    const handleNextUnit = () => {
        if (currentIndex < filteredSyllables.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            Alert.alert(
                '학습 완료',
                '한국어 음절 학습을 모두 완료했습니다.',
                [{ text: '홈으로', onPress: () => navigation.goBack() }]
            );
        }
    };

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

    if (!currentUnitData) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button title="← 뒤로가기" onPress={() => navigation.goBack()} />
                <Text style={styles.headerText}>
                    음절 학습 (KO) | {currentIndex + 1} / {filteredSyllables.length}
                </Text>
            </View>

            <View style={styles.content}>
                <SpeakingEvaluator
                    type="syllable" 
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
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
