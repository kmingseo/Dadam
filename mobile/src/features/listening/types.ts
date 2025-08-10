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
  body : string;
  imageUrl : string;
}

export interface Dictation {
  problemSetId : string;
  problemIndex : number;
}