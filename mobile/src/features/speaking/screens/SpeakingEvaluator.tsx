import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    Platform,
    PermissionsAndroid,
    StyleSheet, 
} from "react-native";
import axios from "axios";
import AudioRecorderPlayer, {
    AudioSet,
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    OutputFormatAndroidType,
    AVEncoderAudioQualityIOSType,
} from "react-native-audio-recorder-player";
import RNFS from "react-native-fs";

export interface WordType {
    id: number | null;
    targetWord: string;
    imageUrl: string;
    languageCode: string;
}

export interface ResultType {
    transcribedText: string;
    score: number;
    targetWord: string;
    imageUrl: string;
}

interface SpeakingEvaluatorProps {
    type: "consonant" | "vowel" | "syllable" | "word" | "sentence";
    currentWord?: WordType;
    onNext?: () => void;
}

const BASE_URL = "http://10.0.2.2:8080";

const typeLabels = {
    "consonant": "자음",
    "vowel": "모음",
    "syllable": "음절",
    "word": "단어",
    "sentence": "문장",
};

const SpeakingEvaluator: React.FC<SpeakingEvaluatorProps> = ({ type, currentWord, onNext }) => {
    const recorderRef = useRef<AudioRecorderPlayer | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [result, setResult] = useState<ResultType>({
        transcribedText: "",
        score: 0,
        targetWord: "",
        imageUrl: "",
    });

    const targetWord = currentWord?.targetWord;
    const languageCode = currentWord?.languageCode;
    const isWordOrSentence = type === 'word' || type === 'sentence'; 

    useEffect(() => {
        recorderRef.current = new AudioRecorderPlayer();
        return () => {
            recorderRef.current?.stopRecorder();
            recorderRef.current?.removeRecordBackListener();
        };
    }, []);

    useEffect(() => {
        setResult({
            transcribedText: "",
            score: 0,
            targetWord: "",
            imageUrl: "",
        });
    }, [currentWord]);

    const requestPermission = async () => {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const startRecording = async () => {
        if (isWordOrSentence && !targetWord) return;

        if (!(await requestPermission())) {
            Alert.alert("권한 필요", "녹음 권한이 필요합니다.");
            return;
        }
        const audioSet: AudioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVSampleRateKeyIOS: 44100,
            AVNumberOfChannelsKeyIOS: 1,
        };

        const path = `${RNFS.CachesDirectoryPath}/record.m4a`;
        try {
            await recorderRef.current?.startRecorder(path, audioSet);
            setIsRecording(true);
        } catch (e) {
            console.error("녹음 시작 오류:", e);
            Alert.alert("녹음 오류", "녹음 시작 실패");
            setIsRecording(false);
        }
    };

    const stopRecording = async () => {
        try {
            const path = await recorderRef.current?.stopRecorder();
            recorderRef.current?.removeRecordBackListener();
            setIsRecording(false);
            if (path) {
                uploadRecording(path);
            }
        } catch (e) {
            console.error("녹음 중지 오류:", e);
            Alert.alert("녹음 오류", "녹음 중지 실패");
        }
    };

    const uploadRecording = async (path: string) => {
        if (!targetWord || !languageCode) {
            Alert.alert("오류", `${typeLabels[type]} 학습에 필요한 데이터가 없습니다.`);
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("audio", {
                uri: path,
                name: "recording.m4a",
                type: "audio/m4a",
            } as any);

            formData.append("word", targetWord);
            formData.append("languageCode", languageCode);

            const res = await axios.post(
                `${BASE_URL}/api/evaluate-speech`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setResult(res.data);
            if (res.data.score < 80) {
                Alert.alert("아쉽습니다", `${res.data.score}점입니다. 다시 시도해 보세요.`);
            } else {
                Alert.alert("합격!", `${res.data.score}점! 다음 ${typeLabels[type]}로 이동할 수 있습니다.`);
            }

        } catch (e) {
            console.error("평가 요청 실패:", e);
            Alert.alert("오류", "평가 실패. 서버 상태를 확인하세요.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoNext = () => {
        if (result.score < 80) {
            Alert.alert("다시 시도", "80점 이상 받아야 다음 단계로 이동할 수 있습니다.");
            return;
        }
        onNext?.();
    };

    const displayedImageUrl = result.imageUrl || currentWord?.imageUrl;
    const isReadyToNext = result.score >= 80;


    return (
        <View style={styles.mainContainer}>
            <Text style={styles.targetText}>
                {targetWord ?? `[${typeLabels[type]} 데이터 준비 중]`}
            </Text>
            {isWordOrSentence && displayedImageUrl && (
                <Image
                    source={{ uri: `${BASE_URL}${displayedImageUrl}` }}
                    style={styles.imageStyle}
                    resizeMode="cover"
                />
            )}

            {!isRecording ? (
                <TouchableOpacity
                    onPress={startRecording}
                    disabled={isLoading || (isWordOrSentence && !targetWord)}
                    style={[styles.buttonBase, {
                        backgroundColor: (isLoading || (isWordOrSentence && !targetWord)) ? "#9ca3af" : "#2563eb",
                    }]}
                >
                    <Text style={styles.buttonText}>🎙 녹음 시작</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={stopRecording}
                    disabled={isLoading}
                    style={[styles.buttonBase, { backgroundColor: "#dc2626" }]}
                >
                    <Text style={styles.buttonText}>⏹ 녹음 중지</Text>
                </TouchableOpacity>
            )}

            {isLoading && <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />}

            {result.score > 0 && (
                <View style={styles.resultBox}>
                    <Text style={styles.resultScore}>점수: {result.score}점</Text>
                    <Text style={styles.resultTranscribed}>인식된 텍스트: {result.transcribedText}</Text>
                </View>
            )}

            {onNext && (
                <TouchableOpacity
                    onPress={handleGoNext}
                    disabled={!isReadyToNext || isLoading || isRecording}
                    style={[styles.buttonBase, styles.nextButton, {
                        backgroundColor: isReadyToNext ? "#16a34a" : "#9ca3af",
                        opacity: isLoading || isRecording ? 0.5 : 1,
                    }]}
                >
                    <Text style={styles.buttonText}>다음 {typeLabels[type]} ➡️</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: 10,
        width: '100%'
    },
    targetText: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 20
    },
    imageStyle: {
        width: 200,
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: '#f3f4f6'
    },
    buttonBase: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        maxWidth: 300,
        marginVertical: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18
    },
    resultBox: {
        marginTop: 20,
        alignItems: "center",
        padding: 15,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    resultScore: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    resultTranscribed: {
        marginTop: 5,
        fontSize: 16
    },
    nextButton: {
        marginTop: 30,
    }
});

export default SpeakingEvaluator;
