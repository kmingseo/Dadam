import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';

const TailwindScript = () => (
    <script src="https://cdn.tailwindcss.com"></script>
);

// 백엔드 API 주소 (필요시 수정하세요)
const BASE_URL = 'http://localhost:8080';

// 단어 모델 타입 정의
const wordType = {
    id: null,
    targetWord: '',
    imageUrl: '',
    languageCode: ''
};

// 평가 결과 타입 정의
const resultType = {
    transcribedText: '',
    score: 0,
    targetWord: '',
    imageUrl: ''
};

// 지원하는 언어 목록
const LANGUAGES = [
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '일본어' },
    { code: 'zh', name: '중국어' },
    { code: 'vi', name: '베트남어' },
];

const SpeechEvaluator = () => {
    // 상태 관리
    const [wordList, setWordList] = useState([]); // 서버에서 가져온 전체 단어 목록
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].code); // 현재 선택된 언어
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentWord, setCurrentWord] = useState(wordType);

    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState(resultType);
    const [statusMessage, setStatusMessage] = useState('마이크 권한 요청 후 시작하세요.');

    // MediaRecorder 관련 Ref
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioStreamRef = useRef(null); // 마이크 스트림 저장

    // useMemo를 사용하여 현재 선택된 언어에 해당하는 단어 목록만 필터링
    const filteredWordList = useMemo(() => {
        // 현재 선택된 언어 코드로만 필터링
        return wordList.filter(word => word.languageCode === selectedLanguage);
    }, [wordList, selectedLanguage]);


    // 1. 초기 로드: 단어 목록 가져오기 및 마이크 권한 요청
    useEffect(() => {
        fetchWordList();
        requestMicrophonePermission();

        // 컴포넌트 언마운트 시 스트림 정리 (메모리 누수 방지)
        return () => {
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (filteredWordList.length > 0 && currentWordIndex < filteredWordList.length) {
            setCurrentWord(filteredWordList[currentWordIndex]);
            setStatusMessage(`"${filteredWordList[currentWordIndex].targetWord}" 발음하기`);
            setEvaluationResult(resultType); // 평가 결과 초기화
        } else if (filteredWordList.length > 0 && currentWordIndex >= filteredWordList.length) {
            setCurrentWord(wordType);
            setStatusMessage('현재 언어의 모든 단어 학습 완료!');
        } else {
            setCurrentWord(wordType);
            setStatusMessage('단어 목록을 불러오는 중이거나 선택된 언어의 단어가 없습니다.');
        }
    }, [filteredWordList, currentWordIndex]);


    useEffect(() => {
        
        setCurrentWordIndex(0);
    }, [selectedLanguage]);


    // [Helper] 마이크 권한 요청
    const requestMicrophonePermission = async () => {
        try {
            // 마이크 스트림 가져오기
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;
            setStatusMessage('마이크 준비 완료. 녹음 버튼을 눌러 시작하세요.');
            return true;
        } catch (error) {
            console.error('Microphone access denied:', error);
            setStatusMessage('❌ 마이크 권한이 필요합니다. 브라우저 설정을 확인하세요.');
            window.alert('마이크 접근 권한이 거부되었습니다. 페이지를 새로고침하고 권한을 허용해주세요.');
            return false;
        }
    };

    // [API] 단어 목록 가져오기
    const fetchWordList = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/words`);
            setWordList(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch word list:', error);
            setStatusMessage('❌ 단어 목록 로드 실패 (백엔드 확인)');
            setIsLoading(false);
        }
    };

    // [Action] 녹음 시작
    const onStartRecord = async () => {
        if (isLoading || isRecording || !audioStreamRef.current) return;

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            return;
        }

        audioChunksRef.current = [];
        try {
            const recorder = new mediaRecorderRef(audioStreamRef.current);

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = onRecordingStop;

            recorder.start();
            mediaRecorderRef.current = recorder;

            setIsRecording(true);
            setStatusMessage('🔴 녹음 중... 중지 버튼을 눌러주세요.');

        } catch (error) {
            console.error('Failed to start recording:', error);
            setStatusMessage('❌ 녹음 시작 실패');
            setIsRecording(false);
        }
    };

    // [Action] 녹음 중지
    const onStopRecord = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setStatusMessage('녹음 중지. 평가 요청 중...');
        }
    };

    // [Helper] 녹음 중지 후 파일 생성 및 업로드
    const onRecordingStop = () => {
        if (audioChunksRef.current.length === 0) {
            console.error('No audio data recorded.');
            setStatusMessage('녹음된 데이터가 없습니다. 다시 시도하세요.');
            return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], "recording.webm", { type: 'audio/webm' });

        uploadAndEvaluate(audioFile, currentWord.id);
    };

    // [API] 파일 업로드 및 평가
    const uploadAndEvaluate = async (audioFile, wordId) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('audio', audioFile);
            formData.append('wordId', wordId.toString());

            // ⭐️ 다국어 지원을 위해 백엔드 API 호출 ⭐️
            const response = await axios.post(`${BASE_URL}/api/evaluate-speech`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setIsLoading(false);
            const data = response.data;

            setEvaluationResult(data);
            setStatusMessage(`평가 완료! 점수: ${data.score}점`);

            if (data.score < 80) {
                window.alert(`아쉽습니다. ${data.score}점입니다. 80점 이상을 목표로 다시 한 번 발음해 보세요!`);
            }

        } catch (error) {
            console.error('Upload Error:', error.response ? error.response.data : error.message);
            const errorMessage = error.response && error.response.data && error.response.data.message ?
                error.response.data.message :
                error.message;

            setStatusMessage(`❌ 평가 중 오류 발생: ${errorMessage.substring(0, 30)}...`);
            setIsLoading(false);
            window.alert(`평가 중 오류가 발생했습니다. 콘솔을 확인해주세요. (${error.response ? error.response.status : 'Network Error'})`);
        }
    };

    // [Action] 다음 단어로 이동
    const goToNextWord = () => {
        if (evaluationResult.score >= 80) {
            setCurrentWordIndex(prevIndex => prevIndex + 1);
        } else {
            window.alert('80점 이상을 받아야 다음 단어로 이동할 수 있습니다.');
        }
    };

    // 현재 UI 렌더링을 위한 계산된 값
    const currentImage = evaluationResult.imageUrl || currentWord.imageUrl;
    const isNextDisabled = currentWord.id === null || evaluationResult.score < 80;
    const isRecordDisabled = isLoading || isRecording || currentWord.id === null || !audioStreamRef.current || filteredWordList.length === 0;

    // 현재 선택된 언어 이름 찾기
    const currentLanguageName = LANGUAGES.find(lang => lang.code === selectedLanguage)?.name || '알 수 없음';


    return (
        <>
            <TailwindScript />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 sm:p-10 font-inter">

                {/* 헤더 및 언어 선택 */}
                <h1 className="text-3xl font-extrabold text-blue-800 mb-2 mt-4 text-center">
                    🗣️ 다국어 발음 학습 앱
                </h1>

                {/* 언어 선택 드롭다운 */}
                <div className="mb-8 w-full max-w-md flex justify-center items-center space-x-2">
                    <label htmlFor="language-select" className="text-gray-700 font-semibold">학습 언어:</label>
                    <select
                        id="language-select"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-lg font-medium"
                        disabled={isLoading}
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 메인 콘텐츠 박스 */}
                <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center transform transition duration-500 hover:shadow-3xl">

                    <p className="text-xl font-bold text-gray-500 mb-2">
                        {currentLanguageName} 단어 학습 ( {currentWordIndex + 1} / {filteredWordList.length} )
                    </p>

                    {/* 단어 및 이미지 */}
                    <p className={`mb-4 tracking-wider ${currentWord.targetWord ? 'text-6xl font-black text-blue-600' : 'text-3xl text-gray-400'}`}>
                        {currentWord.targetWord || '단어 로딩 중...'}
                    </p>

                    <div className="w-48 h-48 rounded-lg overflow-hidden border-4 border-gray-200 shadow-md">
                        <img
                            src={currentImage}
                            alt={currentWord.targetWord}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = `https://placehold.co/192x192/cccccc/000000?text=${currentWord.targetWord || 'Image'}`}
                        />
                    </div>

                    {/* 상태 메시지 */}
                    <p className={`mt-5 text-lg font-medium text-center px-4 transition-colors ${isRecording ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                        {statusMessage}
                    </p>
                </div>

                {/* 녹음 버튼 영역 */}
                <div className="w-full max-w-xs mt-8">
                    {isRecording ? (
                        <button
                            onClick={onStopRecord}
                            className="w-full py-4 px-6 text-xl font-bold rounded-full text-white bg-red-600 hover:bg-red-700 transition duration-150 shadow-lg shadow-red-400 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            🔴 녹음 중지
                        </button>
                    ) : (
                        <button
                            onClick={onStartRecord}
                            className="w-full py-4 px-6 text-xl font-bold rounded-full text-white bg-green-500 hover:bg-green-600 transition duration-150 shadow-lg shadow-green-400 disabled:bg-gray-400 disabled:shadow-none"
                            disabled={isRecordDisabled}
                        >
                            🎙️ 발음 녹음 시작
                        </button>
                    )}
                </div>

                {/* 로딩 인디케이터 */}
                {isLoading && (
                    <div className="mt-4 flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-blue-500 font-semibold">평가 중...</span>
                    </div>
                )}


                {/* 평가 결과 영역 */}
                {evaluationResult.score !== 0 && (
                    <div className={`w-full max-w-md mt-8 p-6 rounded-xl shadow-inner border-4 ${evaluationResult.score >= 80 ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                        <p className="text-xl font-bold text-gray-800 mb-2 text-center">
                            [ 최종 발음 평가 ]
                        </p>
                        <p className="text-center">
                            <span className={`text-6xl font-extrabold ${evaluationResult.score >= 80 ? 'text-green-700' : 'text-red-700'}`}>
                                {evaluationResult.score}
                            </span>
                            <span className="text-2xl font-bold text-gray-600"> 점</span>
                        </p>
                        <p className="text-center text-lg mt-3 text-gray-700">
                            인식된 발음: <span className="font-semibold text-gray-900">"{evaluationResult.transcribedText}"</span>
                        </p>
                    </div>
                )}

                {/* 다음 단어 버튼 */}
                {(evaluationResult.score !== 0 && currentWordIndex < filteredWordList.length) && (
                    <button
                        onClick={goToNextWord}
                        className={`mt-6 py-3 px-8 text-lg font-bold rounded-lg text-white transition duration-150 shadow-lg disabled:bg-gray-400 disabled:shadow-none ${isNextDisabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-300'}`}
                        disabled={isNextDisabled}
                    >
                        {isNextDisabled ? '80점 이상 획득해야 다음으로 이동' : '다음 단어 ➡️'}
                    </button>
                )}

                {/* 학습 완료 메시지 */}
                {(currentWordIndex >= filteredWordList.length && filteredWordList.length > 0) && (
                    <p className="mt-6 text-2xl font-bold text-purple-600 p-3 rounded-lg bg-purple-100 shadow-md">
                        🎉 {currentLanguageName} 학습 완료!
                    </p>
                )}

            </div>
        </>
    );
};

export default SpeechEvaluator;
