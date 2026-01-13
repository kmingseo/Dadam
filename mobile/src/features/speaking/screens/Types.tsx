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
    text: string;           
    imagePath: string;      
    languageCode: LanguageCode; 
}


export interface ResultType {
    transcribedText: string;
    score: number;
    targetWord: string; 
    imageUrl: string;
}

export const initialWord: WordType = {
    id: null,
    text: '',
    imagePath: '',
    languageCode: 'ko' 
};

export const initialResult: ResultType = {
    transcribedText: '',
    score: 0,
    targetWord: '',
    imageUrl: ''
};
