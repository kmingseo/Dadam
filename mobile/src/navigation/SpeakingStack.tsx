// navigation/SpeakingStack.tsx (수정된 최종 코드)
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SpeakingHome from '../features/speaking/screens/SpeakingHome';
import LanguageSelectionScreen from '../features/speaking/screens/LanguageSelectionScreen';
import WordScene from '../features/speaking/screens/WordScene';
import ConsonantVowelScene from '../features/speaking/screens/ConsonantVowelScene';
import SyllableScene from '../features/speaking/screens/SyllableScene';
import SentenceScene from '../features/speaking/screens/SentenceScene';

export type SpeakingStackParamList = {
    SpeakingHome: undefined;
    LanguageSelection: {
        unitType: 'consonant_vowel' | 'syllable' | 'word' | 'sentence';
    };
    WordScene: {
        initialLanguage: 'ko' | 'en' | 'ja' | 'zh' | 'vi';
    };
    ConsonantVowelScene: { initialLanguage: 'ko' | 'en' | 'ja' | 'zh' | 'vi'; };
    SyllableScene: { initialLanguage: 'ko' | 'en' | 'ja' | 'zh' | 'vi'; };
    SentenceScene: { initialLanguage: 'ko' | 'en' | 'ja' | 'zh' | 'vi'; };
};

const Stack = createNativeStackNavigator<SpeakingStackParamList>();

export default function SpeakingStack() {
    return (
        <Stack.Navigator
            initialRouteName="SpeakingHome"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen
                name="SpeakingHome"
                component={SpeakingHome}
            />

            <Stack.Screen
                name="LanguageSelection"
                component={LanguageSelectionScreen}
            />

            <Stack.Screen
                name="WordScene"
                component={WordScene}
            />

            <Stack.Screen
                name="ConsonantVowelScene"
                component={ConsonantVowelScene}
            />
            <Stack.Screen
                name="SyllableScene"
                component={SyllableScene}
            />
            <Stack.Screen
                name="SentenceScene"
                component={SentenceScene}
            />
        </Stack.Navigator>
    );
}
