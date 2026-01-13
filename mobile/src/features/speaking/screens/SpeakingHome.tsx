import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SpeakingStackParamList } from '/Users/m1/Desktop/Dadam/mobile/src/navigation/SpeakingStack.tsx';

type LearningUnit = 'consonant_vowel' | 'syllable' | 'word' | 'sentence';
type BearImageKey = keyof typeof IMAGE_SOURCES;

type SpeakingHomeNavigationProp = NativeStackNavigationProp<
    SpeakingStackParamList,
    'SpeakingHome'
>;

const HEADER_IMAGE_SOURCE = require('../images/header.png');
const IMAGE_SOURCES = {
    consonant_vowel: require('../images/bear1.png'),
    syllable: require('../images/bear2.png'),
    word: require('../images/bear3.png'),
    sentence: require('../images/bear4.png'),
};

const LEARNING_UNITS: { key: LearningUnit; label: string; scope: string; bearColor: string; imageKey: BearImageKey }[] = [
    { key: 'consonant_vowel', label: '자음/모음', scope: '자음/모음', bearColor: '#fff8e3', imageKey: 'consonant_vowel' },
    { key: 'syllable', label: '음절(가나다)', scope: '음절(가나다)', bearColor: '#fff0cc', imageKey: 'syllable' },
    { key: 'word', label: '단어', scope: '단어', bearColor: '#ffe9b3', imageKey: 'word' },
    { key: 'sentence', label: '문장', scope: '문장', bearColor: '#ffda7f', imageKey: 'sentence' },
];

export default function SpeakingHome() {
    const navigation = useNavigation<SpeakingHomeNavigationProp>();
    const handleUnitSelect = (unitKey: LearningUnit) => {

        // 1. 다국어 선택이 필요한 경우 (단어, 문장)
        if (unitKey === 'word' || unitKey === 'sentence') {
            navigation.navigate('LanguageSelection', { unitType: unitKey });
        }

        // 2. 한국어만 필요한 경우 (자음/모음, 음절)
        else if (unitKey === 'consonant_vowel') {
            navigation.navigate('ConsonantVowelScene', { initialLanguage: 'ko' });
        }

        else if (unitKey === 'syllable') {
            navigation.navigate('SyllableScene', { initialLanguage: 'ko' });
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Image
                    source={HEADER_IMAGE_SOURCE}
                    style={styles.headerImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.unitContainer}>
                {LEARNING_UNITS.map((unit) => (
                    <TouchableOpacity
                        key={unit.key}
                        style={styles.unitButton}
                        onPress={() => handleUnitSelect(unit.key)}
                    >
                        <View style={[styles.unitContent, { backgroundColor: unit.bearColor }]}>
                            <Image
                                source={IMAGE_SOURCES[unit.imageKey]}
                                style={styles.bearImage}
                                resizeMode="contain"
                            />
                            <View style={styles.labelWrapper}>
                                <Text style={styles.unitLabel}>{unit.label}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.bottomInstruction}>
                아이의 수준에 맞는 단계를 선택해 학습해 보세요.
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffbe6',
        alignItems: 'center',
        paddingVertical: 20,
    },
    headerContainer: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 30,
    },
    headerImage: {
        width: 150,
        height: 50,
    },
    unitContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 10,
        flexGrow: 1,
        alignContent: 'center',
    },
    unitButton: {
        width: '48%',
        maxWidth: 250,
        margin: 5,
        alignItems: 'center',
    },
    unitContent: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative',
        overflow: 'hidden',
    },
    bearImage: {
        width: '80%',
        height: '80%',
        position: 'absolute',
        top: 0,
    },
    labelWrapper: {
        position: 'absolute',
        bottom: '5%',
        width: '100%',
        paddingVertical: 5,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    unitLabel: {
        fontSize: 25,
        fontWeight: '900',
        color: '#3c3c3c',
        textAlign: 'center',
    },
    bottomInstruction: {
        fontSize: 20,
        color: '#777',
        marginTop: 'auto',
        marginBottom: 20,
        textAlign: 'center',
    },
});
