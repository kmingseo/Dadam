export type LearningUnit = 'consonant_vowel' | 'syllable' | 'word' | 'sentence' | null;

export type LanguageCode = 'ko' | 'ja' | 'zh' | 'en' | 'vi';

export interface LanguageType {
    code: LanguageCode;
    name: string;
}

export const LANGUAGES: LanguageType[] = [
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '일본어' },
    { code: 'zh', name: '중국어' },
    { code: 'en', name: '영어' },
    { code: 'vi', name: '베트남어' },
];


export interface WordType {
    id: number | null;
    text: string;           // '사과', 'apple' 등 실제 단어/문자
    imagePath: string;      // '/images/apple.jpg' 등 이미지 서버 경로
    languageCode: LanguageCode; // 'ko', 'ja' 등
}


export interface ResultType {
    transcribedText: string;
    score: number;
    targetWord: string; // 평가 대상 단어/문장
    imageUrl: string;
}

export const initialWord: WordType = {
    id: null,
    text: '',
    imagePath: '',
    languageCode: 'ko' // 기본 언어는 한국어로 설정
};

/** ResultType의 초기 상태 값 */
export const initialResult: ResultType = {
    transcribedText: '',
    score: 0,
    targetWord: '',
    imageUrl: ''
};