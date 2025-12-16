// WordScene.tsx (최종 수정 - 다국어 데이터 완성)

import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Button,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';

import SpeakingEvaluator, { WordType } from './SpeakingEvaluator';
import { SpeakingStackParamList } from '/Users/m1/Desktop/Dadam/mobile/src/navigation/SpeakingStack.tsx';

// ⚠️ 서버 설정
const BASE_URL = 'http://10.0.2.2:8080';
const WORDS_API_URL = `${BASE_URL}/api/words`; // 백엔드에서 getAllWords()에 매핑될 엔드포인트 가정

// ⭐️ ⭐️ ⭐️ LANGUAGES 배열 완성 ⭐️ ⭐️ ⭐️
const LANGUAGES = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: '영어' },
    { code: 'ja', name: '일본어' },
    { code: 'zh', name: '중국어' },
    { code: 'vi', name: '베트남어' },
];

// ⭐️ ⭐️ ⭐️ MOCK_WORDS 배열 완성 (DataService.java 기반) ⭐️ ⭐️ ⭐️
const IMAGE_BASE_PATH = '/images';
const MOCK_WORDS: WordType[] = [
    // 사과 (Apple)
    { id: 10, targetWord: '사과', imageUrl: IMAGE_BASE_PATH + "/apple.png", languageCode: 'ko' },
    { id: 11, targetWord: 'りんご', imageUrl: IMAGE_BASE_PATH + "/apple.png", languageCode: 'ja' },
    { id: 12, targetWord: '苹果', imageUrl: IMAGE_BASE_PATH + "/apple.png", languageCode: 'zh' },
    { id: 13, targetWord: 'apple', imageUrl: IMAGE_BASE_PATH + "/apple.png", languageCode: 'en' },
    { id: 14, targetWord: 'táo', imageUrl: IMAGE_BASE_PATH + "/apple.png", languageCode: 'vi' },

    // 사탕 (Candy)
    { id: 20, targetWord: '사탕', imageUrl: IMAGE_BASE_PATH + "/candy.png", languageCode: 'ko' },
    { id: 21, targetWord: 'あめ', imageUrl: IMAGE_BASE_PATH + "/candy.png", languageCode: 'ja' },
    { id: 22, targetWord: '糖果', imageUrl: IMAGE_BASE_PATH + "/candy.png", languageCode: 'zh' },
    { id: 23, targetWord: 'candy', imageUrl: IMAGE_BASE_PATH + "/candy.png", languageCode: 'en' },
    { id: 24, targetWord: 'kẹo', imageUrl: IMAGE_BASE_PATH + "/candy.png", languageCode: 'vi' },

    // 나무 (Tree)
    { id: 30, targetWord: '나무', imageUrl: IMAGE_BASE_PATH + "/tree.png", languageCode: 'ko' },
    { id: 31, targetWord: 'き', imageUrl: IMAGE_BASE_PATH + "/tree.png", languageCode: 'ja' },
    { id: 32, targetWord: '树', imageUrl: IMAGE_BASE_PATH + "/tree.png", languageCode: 'zh' },
    { id: 33, targetWord: 'tree', imageUrl: IMAGE_BASE_PATH + "/tree.png", languageCode: 'en' },
    { id: 34, targetWord: 'cây', imageUrl: IMAGE_BASE_PATH + "/tree.png", languageCode: 'vi' },

    // 사자 (Lion)
    { id: 40, targetWord: '사자', imageUrl: IMAGE_BASE_PATH + "/lion.png", languageCode: 'ko' },
    { id: 41, targetWord: 'ライオン', imageUrl: IMAGE_BASE_PATH + "/lion.png", languageCode: 'ja' },
    { id: 42, targetWord: '狮子', imageUrl: IMAGE_BASE_PATH + "/lion.png", languageCode: 'zh' },
    { id: 43, targetWord: 'lion', imageUrl: IMAGE_BASE_PATH + "/lion.png", languageCode: 'en' },
    { id: 44, targetWord: 'sư tử', imageUrl: IMAGE_BASE_PATH + "/lion.png", languageCode: 'vi' },

    // 책 (Book)
    { id: 50, targetWord: '책', imageUrl: IMAGE_BASE_PATH + "/book.png", languageCode: 'ko' },
    { id: 51, targetWord: 'ほん', imageUrl: IMAGE_BASE_PATH + "/book.png", languageCode: 'ja' },
    { id: 52, targetWord: '书', imageUrl: IMAGE_BASE_PATH + "/book.png", languageCode: 'zh' },
    { id: 53, targetWord: 'book', imageUrl: IMAGE_BASE_PATH + "/book.png", languageCode: 'en' },
    { id: 54, targetWord: 'sách', imageUrl: IMAGE_BASE_PATH + "/book.png", languageCode: 'vi' }
];

// 🔑 navigation / route 타입
type Props = NativeStackScreenProps<
    SpeakingStackParamList,
    'WordScene' // WordScene 스크린 이름
>;

export default function WordScene({ route, navigation }: Props) {
    const { initialLanguage } = route.params;

    const [allWords, setAllWords] = useState<WordType[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 서버에서 단어 데이터 불러오기
    useEffect(() => {
        const fetchWords = async () => {
            try {
                // ⚠️ API 호출 시, 서버의 실제 Word DTO 필드 이름(id, targetWord, imageUrl, languageCode)과 일치하도록 확인 필요
                const response = await axios.get<any[]>(WORDS_API_URL);

                const processedWords: WordType[] = response.data
                    .map((word): WordType => ({
                        id: word.id ?? Date.now() + Math.random(),
                        targetWord: word.targetWord ?? word.text ?? '',
                        imageUrl: word.imageUrl ?? '',
                        languageCode: word.languageCode ?? word.language ?? 'ko',
                    }))
                    .filter(w => w.targetWord.trim() !== '');

                // ⭐️ 서버 데이터가 있으면 사용, 없으면 전체 MOCK 데이터 사용
                setAllWords(processedWords.length > 0 ? processedWords : MOCK_WORDS);

                if (processedWords.length === 0) {
                    Alert.alert('경고', '서버 단어 목록이 비어있어 MOCK 데이터로 대체합니다.');
                }
            } catch (error) {
                console.error('단어 데이터 불러오기 실패:', error);
                // ⭐️ 오류 발생 시 전체 MOCK 데이터로 대체
                setAllWords(MOCK_WORDS);
                Alert.alert(
                    '경고',
                    '단어 목록을 서버에서 가져오지 못해 MOCK 데이터로 대체합니다.'
                );
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchWords();
    }, []);

    // 언어 필터링
    const filteredWords = useMemo(() => {
        // allWords (서버 데이터 또는 MOCK 데이터)를 initialLanguage로 필터링
        return allWords.filter(word => word.languageCode === initialLanguage);
    }, [allWords, initialLanguage]);

    const currentWordData = filteredWords[currentIndex] ?? null;

    // 다음 단어
    const handleNextWord = () => {
        if (currentIndex < filteredWords.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            Alert.alert(
                '학습 완료',
                `${LANGUAGES.find(l => l.code === initialLanguage)?.name} 단어 학습 완료!`,
                [
                    {
                        text: '확인',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        }
    };

    // 로딩 상태 처리
    if (isLoadingData) {
        return (
            <View style={[styles.container, { backgroundColor: '#FFFACD' }]}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10 }}>단어 데이터를 불러오는 중...</Text>
            </View>
        );
    }

    // 단어 없음 상태 처리: currentWordData가 null이면 SpeakingEvaluator를 렌더링하지 않습니다.
    if (!currentWordData) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#FFFACD' }]}>
                <View style={styles.header}>
                    <Button title="← 뒤로가기" onPress={() => navigation.goBack()} />
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ marginTop: 20 }}>
                        선택한 언어의 단어 목록이 비어있습니다.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const languageName =
        LANGUAGES.find(l => l.code === initialLanguage)?.name ??
        initialLanguage.toUpperCase();

    // 메인 렌더링
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#FFFACD' }]}>
            <View style={styles.header}>
                <Button title="← 뒤로가기" onPress={() => navigation.goBack()} />
                <Text style={styles.languageStatus}>
                    {languageName} 학습 중 ({currentIndex + 1} / {filteredWords.length})
                </Text>
            </View>

            <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                <SpeakingEvaluator
                    type="word"
                    currentWord={currentWordData}
                    onNext={handleNextWord}
                />
            </View>
        </SafeAreaView>
    );
}

// 스타일 유지
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    languageStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});