export interface CardSelectRequest {
  problemSetId: string;
  problemIndex: number;
  selectedCardIndex : number;
}

export interface CardProblem {
  problemSetId : string;
  problemIndex : number;
}

export interface Card {
  wordId : number;
  body : string;
  imageUrl : string;
  translatedBody : string;
}

export interface Dictation {
  problemSetId : string;
  problemIndex : number;
}

export interface DictationProb {
  id : number;
  body : string;
  translatedBody : string;
  type: 'word' | 'sentence'
}

export interface DictationRequest {
  imageBase64: string;
  problemSetId: string;
  problemIndex: number;
}
