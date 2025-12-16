import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Button,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// useNavigation 대신 NativeStackScreenProps를 사용하여 route와 navigation을 받습니다.

// ⚠️ SpeakingStackParamList 경로 확인 필수
import { SpeakingStackParamList } from '/Users/m1/Desktop/Dadam/mobile/src/navigation/SpeakingStack.tsx';

type LanguageCode = 'ko' | 'en' | 'ja' | 'zh' | 'vi';
type LearningUnit = 'consonant_vowel' | 'syllable' | 'word' | 'sentence';


// 🔑 Props 타입 정의: route에서 unitType 파라미터를 받기 위해 NativeStackScreenProps 사용
type Props = NativeStackScreenProps<
    SpeakingStackParamList,
    'LanguageSelection'
>;


const LANGUAGES: { code: LanguageCode; name: string }[] = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: '영어' },
    { code: 'ja', name: '일본어' },
    { code: 'zh', name: '중국어' },
    { code: 'vi', name: '베트남어' },
];

// ⭐️ route와 navigation을 props로 받도록 함수 시그니처 변경
export default function LanguageSelectionScreen({ route, navigation }: Props) {

    // ⭐️ 1. SpeakingHome에서 전달받은 unitType 파라미터 추출
    //    (SpeakingStackParamList가 LanguageSelection에 { unitType: LearningUnit }을 정의해야 함)
    const { unitType } = route.params;

    // ⭐️ 2. unitType에 따라 이동할 스크린 이름을 결정하는 함수
    const getTargetScreenName = (unitType: LearningUnit): keyof SpeakingStackParamList => {
        switch (unitType) {
            case 'consonant_vowel':
                // SpeakingStack에 ConsonantVowelScene이 등록되어 있어야 함
                return 'ConsonantVowelScene' as keyof SpeakingStackParamList;
            case 'syllable':
                // SpeakingStack에 SyllableScene이 등록되어 있어야 함
                return 'SyllableScene' as keyof SpeakingStackParamList;
            case 'word':
                return 'WordScene';
            case 'sentence':
                // SpeakingStack에 SentenceScene이 등록되어 있어야 함
                return 'SentenceScene' as keyof SpeakingStackParamList;
            default:
                return 'SpeakingHome'; // 안전 장치
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Button
                    title="← 뒤로가기"
                    onPress={() => navigation.goBack()}
                    color="#2563eb"
                />
            </View>

            <View style={styles.container}>
                <Text style={styles.title}>🗣️ 학습할 언어를 선택하세요</Text>

                {LANGUAGES.map(lang => (
                    <TouchableOpacity
                        key={lang.code}
                        style={styles.languageButton}
                        onPress={() => {
                            // ⭐️ 3. 선택된 unitType에 맞는 최종 목적지 스크린 이름을 가져옵니다.
                            const targetScreen = getTargetScreenName(unitType);

                            // ⭐️ 4. 결정된 스크린으로 initialLanguage 파라미터를 전달하여 이동
                            //    (WordScene 외 다른 씬들도 initialLanguage를 받을 수 있도록 SpeakingStackParamList를 수정해야 합니다.)
                            navigation.navigate(targetScreen as any, {
                                initialLanguage: lang.code,
                            });
                        }}
                    >
                        <Text style={styles.buttonText}>{lang.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

// 스타일은 변경 없음
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFACD',
    },
    header: {
        paddingHorizontal: 15,
        paddingTop: 10,
        width: '100%',
        alignItems: 'flex-start',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    languageButton: {
        width: '80%',
        paddingVertical: 16,
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: '#2563eb',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});