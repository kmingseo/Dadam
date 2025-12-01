import React from 'react';
import { View, Text, Button } from 'react-native';
import SpeakingEvaluator from './SpeakingEvaluator.tsx';

export default function ConsonantVowelScene({ onBack }: { onBack: () => void }) {
    return (
        <View style={{ flex: 1 }}>
            <Button title="← 뒤로가기" onPress={onBack} />
            <SpeakingEvaluator type="consonant" />
        </View>
    );
}
