export type LearningUnit = 'consonant_vowel' | 'syllable' | 'word' | 'sentence' | null;

/** 백엔드에서 가져오는 단어 모델 타입 */
export interface WordType {
    id: number | null;
    targetWord: string;
    imageUrl: string;
    languageCode: string; // 'ko', 'ja' 등
}

/** 발음 평가 API 결과 타입 */
export interface ResultType {
    transcribedText: string;
    score: number;
    targetWord: string;
    imageUrl: string;
}

/** 지원하는 언어 모델 타입 */
export interface LanguageType {
    code: string;
    name: string;
}

/** 초기 상태 값 */
export const initialWord: WordType = {
    id: null,
    targetWord: '',
    imageUrl: '',
    languageCode: ''
};

export const initialResult: ResultType = {
    transcribedText: '',
    score: 0,
    targetWord: '',
    imageUrl: ''
};