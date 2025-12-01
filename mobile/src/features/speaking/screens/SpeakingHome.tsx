// SpeakingHome.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import ConsonantVowelScene from './ConsonantVowelScene';
import SyllableScene from './SyllableScene';
import WordScene from './WordScene';
import SentenceScene from './SentenceScene';
import { LearningUnit } from './Types';

const LEARNING_UNITS: { key: LearningUnit; label: string; scope: string }[] = [
    { key: 'consonant_vowel', label: '자음/모음', scope: '한글만' },
    { key: 'syllable', label: '음절 (가/나/다)', scope: '한글만' },
    { key: 'word', label: '단어', scope: '다국어' },
    { key: 'sentence', label: '문장', scope: '다국어' },
];

export default function SpeakingHome() {
    const [selectedUnit, setSelectedUnit] = useState<LearningUnit | null>(null);

    // 씬 렌더링
    switch (selectedUnit) {
        case 'consonant_vowel':
            return <ConsonantVowelScene onBack={() => setSelectedUnit(null)} />;
        case 'syllable':
            return <SyllableScene onBack={() => setSelectedUnit(null)} />;
        case 'word':
            return <WordScene onBack={() => setSelectedUnit(null)} />;
        case 'sentence':
            return <SentenceScene onBack={() => setSelectedUnit(null)} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>🗣️ 학습 유형 선택</Text>
            <Text style={styles.subHeader}>원하는 발음 학습 단위를 선택하세요.</Text>

            <View style={styles.unitContainer}>
                {LEARNING_UNITS.map((unit) => (
                    <TouchableOpacity
                        key={unit.key}
                        style={styles.unitButton}
                        onPress={() => setSelectedUnit(unit.key)}
                    >
                        <Text style={styles.unitLabel}>{unit.label}</Text>
                        <Text style={styles.unitScope}>{unit.scope}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 16,
        color: '#4b5563',
        marginBottom: 40,
        textAlign: 'center',
    },
    unitContainer: {
        width: '100%',
        maxWidth: 400,
    },
    unitButton: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        alignItems: 'center',
    },
    unitLabel: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    unitScope: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 5,
    },
});
