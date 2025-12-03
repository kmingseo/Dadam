import React, { useEffect, useState, useRef, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    Platform,
    PermissionsAndroid,
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
}

const BASE_URL = "http://10.0.2.2:8080";

const LANGUAGES = [
    { code: "ko", name: "한국어" },
    { code: "ja", name: "일본어" },
    { code: "zh", name: "중국어" },
    { code: "vi", name: "베트남어" },
];

const SpeakingEvaluator: React.FC<SpeakingEvaluatorProps> = ({ type }) => {
    const audioRecorderPlayerRef = useRef<any>(null);

    const [wordList, setWordList] = useState<WordType[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].code);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentWord, setCurrentWord] = useState<WordType>({
        id: null,
        targetWord: "",
        imageUrl: "",
        languageCode: "",
    });
    const [recordedFilePath, setRecordedFilePath] = useState<string>("");
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState<ResultType>({
        transcribedText: "",
        score: 0,
        targetWord: "",
        imageUrl: "",
    });
    const [statusMessage, setStatusMessage] = useState("녹음 버튼을 눌러 시작하세요.");

    const filteredWordList = useMemo(
        () => wordList.filter((w) => w.languageCode === selectedLanguage),
        [wordList, selectedLanguage]
    );

    useEffect(() => {
        fetchWordList();

        audioRecorderPlayerRef.current = new AudioRecorderPlayer();

        return () => {
            audioRecorderPlayerRef.current?.stopRecorder();
            audioRecorderPlayerRef.current?.removeRecordBackListener();
        };
    }, []);

    useEffect(() => {
        if (filteredWordList.length === 0) return;

        setCurrentWord(filteredWordList[currentWordIndex]);
        setEvaluationResult({
            transcribedText: "",
            score: 0,
            targetWord: "",
            imageUrl: "",
        });
        setStatusMessage(`"${filteredWordList[currentWordIndex].targetWord}" 발음하기`);
    }, [filteredWordList, currentWordIndex]);

    // 🔹 정상 복구된 fetchWordList (GET 요청)
    const fetchWordList = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/${type}s`);
            console.log("백엔드 응답:", res.data);

            const mapped = res.data.map((item: any) => {
                if (typeof item === "string") {
                    return {
                        id: null,
                        targetWord: item,
                        imageUrl: "",
                        languageCode: "ko",
                    };
                } else {
                    return {
                        id: item.id ?? null,
                        targetWord: item.text ?? "",
                        imageUrl: item.imageUrl ?? "",
                        languageCode: item.language ?? "ko",
                    };
                }
            });

            setWordList(mapped);
        } catch (e) {
            console.error("단어 목록 불러오기 실패:", e);
            Alert.alert("에러", "단어 목록을 불러오지 못했습니다.");
        }
    };

    const requestRecordingPermission = async () => {
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert("권한 필요", "녹음 권한이 필요합니다.");
                    return false;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const startRecording = async () => {
        const hasPermission = await requestRecordingPermission();
        if (!hasPermission) return;

        try {
            const audioSet: AudioSet = {
                AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: AudioSourceAndroidType.MIC,
                AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 2,
                AVSampleRateKeyIOS: 44100,
                OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
            };

            const path = Platform.select({
                ios: `${RNFS.CachesDirectoryPath}/hello.m4a`,
                android: `${RNFS.CachesDirectoryPath}/hello.m4a`,
            });

            const uri = await audioRecorderPlayerRef.current.startRecorder(path!, audioSet);

            audioRecorderPlayerRef.current.addRecordBackListener((e: any) => {
                console.log("Record Time:", e.currentPosition);
            });

            setIsRecording(true);
            setStatusMessage("🔴 녹음 중...");
            setRecordedFilePath(uri);
        } catch (e) {
            console.error("녹음 시작 오류:", e);
            Alert.alert("녹음 오류", "녹음 시작 실패");
            setIsRecording(false);
        }
    };

    const stopRecording = async () => {
        try {
            const filePath = await audioRecorderPlayerRef.current.stopRecorder();
            audioRecorderPlayerRef.current.removeRecordBackListener();

            setIsRecording(false);
            setRecordedFilePath(filePath);
            setStatusMessage("녹음 완료! 평가 요청 중...");
            uploadRecording(filePath);
        } catch (e) {
            Alert.alert("녹음 오류", "녹음 중지 실패");
        }
    };

    const uploadRecording = async (filePath: string) => {
        if (!currentWord.targetWord) return;

        setIsLoading(true);
        try {
            // 1. fileUri 변수 생성 로직 제거/수정 (filePath를 그대로 사용)
            // 2. name과 type을 플랫폼에 맞게 동적으로 설정

            const formData = new FormData();
            formData.append("audio", {
                uri: filePath, // 녹음기가 반환한 경로 그대로 사용
                name: Platform.OS === "ios" ? "recording.m4a" : "recording.mp4",
                type: Platform.OS === "ios" ? "audio/m4a" : "audio/mp4",
            });
            formData.append("word", currentWord.targetWord);

            // Axios 헤더를 명시적으로 설정하여 확실하게 전송
            const res = await axios.post(`${BASE_URL}/api/evaluate-speech`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const data: ResultType = res.data;
            setEvaluationResult(data);
            setStatusMessage(`평가 완료! 점수: ${data.score}`);

            if (data.score < 80) Alert.alert("아쉽습니다", `${data.score}점입니다.`);
        } catch (e) {
            console.error("평가 요청 실패:", e);
            // 서버 콘솔에 로그가 찍히는지 확인
            Alert.alert("오류", "평가 요청 실패. 서버 상태를 확인하세요.");
        } finally {
            setIsLoading(false);
        }
    };

    const goNext = () => {
        if (evaluationResult.score < 80) {
            Alert.alert("다시 시도", "80점 이상 받아야 넘어갈 수 있어요.");
            return;
        }
        if (currentWordIndex >= filteredWordList.length - 1) {
            Alert.alert("완료", "모든 단어를 평가했습니다!");
            return;
        }
        setCurrentWordIndex((prev) => prev + 1);
    };

    const displayedImage = evaluationResult.imageUrl || currentWord.imageUrl;
    const canGoNext = evaluationResult.score >= 80;

    return (
        <View style={{ flex: 1, alignItems: "center", paddingTop: 40 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
                Speaking Practice — {type}
            </Text>

            <Text style={{ fontSize: 18, marginBottom: 10 }}>{statusMessage}</Text>

            {displayedImage && (
                <Image
                    source={{ uri: displayedImage }}
                    style={{ width: 200, height: 200, borderRadius: 12, marginBottom: 20 }}
                />
            )}

            <Text style={{ fontSize: 28, fontWeight: "600", marginBottom: 20 }}>
                {currentWord.targetWord}
            </Text>

            {!isRecording ? (
                <TouchableOpacity
                    onPress={startRecording}
                    disabled={isLoading}
                    style={{
                        padding: 16,
                        backgroundColor: isLoading ? "#9ca3af" : "#2563eb",
                        borderRadius: 12,
                        marginBottom: 16,
                    }}
                >
                    <Text style={{ color: "white", fontSize: 18 }}>🎙️ 녹음 시작</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={stopRecording}
                    style={{
                        padding: 16,
                        backgroundColor: "#dc2626",
                        borderRadius: 12,
                        marginBottom: 16,
                    }}
                >
                    <Text style={{ color: "white", fontSize: 18 }}>⏹️ 녹음 중지</Text>
                </TouchableOpacity>
            )}

            {isLoading && <ActivityIndicator size="large" style={{ marginBottom: 20 }} />}

            {evaluationResult.score > 0 && (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <Text style={{ fontSize: 20, marginBottom: 10 }}>
                        점수: {evaluationResult.score}점
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                        인식된 텍스트: {evaluationResult.transcribedText}
                    </Text>
                </View>
            )}

            <TouchableOpacity
                disabled={!canGoNext || isLoading}
                onPress={goNext}
                style={{
                    opacity: !canGoNext || isLoading ? 0.5 : 1,
                    marginTop: 30,
                    padding: 14,
                    backgroundColor: "#16a34a",
                    borderRadius: 12,
                }}
            >
                <Text style={{ color: "white", fontSize: 18 }}>다음 단어 ➡️</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SpeakingEvaluator;
