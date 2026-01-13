import React, { useState, useMemo, useEffect } from 'react';
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

type Props = NativeStackScreenProps<SpeakingStackParamList, 'SentenceScene'>;

const MOCK_SENTENCES: WordType[] = [
    // 1. 사과를 먹어요 (I eat an apple)
    { id: 10, targetWord: '나는 사과를 먹어요.', imageUrl: '/images/apple.png', languageCode: 'ko' },
    { id: 11, targetWord: 'I eat an apple.', imageUrl: '/images/apple.png', languageCode: 'en' },
    { id: 12, targetWord: '私はりんごを食べます。', imageUrl: '/images/apple.png', languageCode: 'ja' },
    { id: 13, targetWord: '我吃一个苹果。', imageUrl: '/images/apple.png', languageCode: 'zh' },
    { id: 14, targetWord: 'Tôi ăn một quả táo.', imageUrl: '/images/apple.png', languageCode: 'vi' },

    // 2. 사탕을 먹어요 (I eat candy)
    { id: 20, targetWord: '나는 사탕을 먹어요.', imageUrl: '/images/candy.png', languageCode: 'ko' },
    { id: 21, targetWord: 'I eat candy.', imageUrl: '/images/candy.png', languageCode: 'en' },
    { id: 22, targetWord: '私はあめを食べます。', imageUrl: '/images/candy.png', languageCode: 'ja' },
    { id: 23, targetWord: '我吃糖果。', imageUrl: '/images/candy.png', languageCode: 'zh' },
    { id: 24, targetWord: 'Tôi ăn kẹo.', imageUrl: '/images/candy.png', languageCode: 'vi' },

    // 3. 나무를 심어요 (I plant a tree)
    { id: 30, targetWord: '나는 나무를 심어요.', imageUrl: '/images/tree.png', languageCode: 'ko' },
    { id: 31, targetWord: 'I plant a tree.', imageUrl: '/images/tree.png', languageCode: 'en' },
    { id: 32, targetWord: '私は木を植えます。', imageUrl: '/images/tree.png', languageCode: 'ja' },
    { id: 33, targetWord: '我种一棵树。', imageUrl: '/images/tree.png', languageCode: 'zh' },
    { id: 34, targetWord: 'Tôi trồng một cái cây.', imageUrl: '/images/tree.png', languageCode: 'vi' },

    // 4. 사자가 울어요 (A lion roars)
    { id: 40, targetWord: '사자가 울어요.', imageUrl: '/images/lion.png', languageCode: 'ko' },
    { id: 41, targetWord: 'A lion roars.', imageUrl: '/images/lion.png', languageCode: 'en' },
    { id: 42, targetWord: 'ライオンが吠えます。', imageUrl: '/images/lion.png', languageCode: 'ja' },
    { id: 43, targetWord: '狮子在吼叫。', imageUrl: '/images/lion.png', languageCode: 'zh' },
    { id: 44, targetWord: 'Một con sư tử gầm.', imageUrl: '/images/lion.png', languageCode: 'vi' },

    // 5. 책을 읽어요 (I read a book)
    { id: 50, targetWord: '나는 책을 읽어요.', imageUrl: '/images/book.png', languageCode: 'ko' },
    { id: 51, targetWord: 'I read a book.', imageUrl: '/images/book.png', languageCode: 'en' },
    { id: 52, targetWord: '私は本を読みます。', imageUrl: '/images/book.png', languageCode: 'ja' },
    { id: 53, targetWord: '我读一本书。', imageUrl: '/images/book.png', languageCode: 'zh' },
    { id: 54, targetWord: 'Tôi đọc một cuốn sách.', imageUrl: '/images/book.png', languageCode: 'vi' },
];


export default function SentenceScene({ route, navigation }: Props) {
    const { initialLanguage } = route.params;

    const [allSentences, setAllSentences] = useState<WordType[]>(MOCK_SENTENCES);
    const [isLoadingData, setIsLoadingData] = useState(false); // MOCK 사용 시 로딩은 false로 시작
    const [currentIndex, setCurrentIndex] = useState(0);

    const filteredSentences = useMemo(() => {
        // 선택된 언어에 맞는 문장만 필터링
        return allSentences.filter(sentence => sentence.languageCode === initialLanguage);
    }, [allSentences, initialLanguage]);

    const currentSentenceData = filteredSentences[currentIndex];

    const handleNextSentence = () => {
        if (currentIndex < filteredSentences.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            Alert.alert(
                '학습 완료',
                `${initialLanguage.toUpperCase()} 문장 학습을 완료했습니다.`,
                [{ text: '홈으로', onPress: () => navigation.popToTop() }] // SpeakingHome으로 이동
            );
        }
    };


    if (isLoadingData) {
        return <ActivityIndicator size="large" style={styles.loading} />;
    }

    if (filteredSentences.length === 0) {
        return <Text style={styles.emptyText}>해당 언어({initialLanguage.toUpperCase()})의 문장 목록이 없습니다. (MOCK)</Text>;
    }

    if (!currentSentenceData) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button title="← 뒤로가기" onPress={() => navigation.goBack()} />
                <Text style={styles.headerText}>
                    {initialLanguage.toUpperCase()} 문장 | {currentIndex + 1} / {filteredSentences.length}
                </Text>
            </View>

            <View style={styles.content}>
                <SpeakingEvaluator
                    type="sentence" 
                    currentWord={currentSentenceData}
                    onNext={handleNextSentence}
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
        alignItems: 'center',
        paddingTop: 20,
    },
    loading: {
        flex: 1,
        justifyContent: 'center'
    },
    emptyText: {
        flex: 1,
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#6b7280'
    }
});
