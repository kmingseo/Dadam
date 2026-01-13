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

import { SpeakingStackParamList } from '/Users/m1/Desktop/Dadam/mobile/src/navigation/SpeakingStack.tsx';

type LanguageCode = 'ko' | 'en' | 'ja' | 'zh' | 'vi';
type LearningUnit = 'consonant_vowel' | 'syllable' | 'word' | 'sentence';

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

export default function LanguageSelectionScreen({ route, navigation }: Props) {

    const { unitType } = route.params;

    const getTargetScreenName = (unitType: LearningUnit): keyof SpeakingStackParamList => {
        switch (unitType) {
            case 'consonant_vowel':
                return 'ConsonantVowelScene' as keyof SpeakingStackParamList;
            case 'syllable':
                return 'SyllableScene' as keyof SpeakingStackParamList;
            case 'word':
                return 'WordScene';
            case 'sentence':
                return 'SentenceScene' as keyof SpeakingStackParamList;
            default:
                return 'SpeakingHome'; 
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
                            const targetScreen = getTargetScreenName(unitType);
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
