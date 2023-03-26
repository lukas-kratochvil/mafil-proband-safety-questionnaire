export enum QuestionPartNumber {
  ONE = 1,
  TWO = 2,
}

export interface IQuestionData {
  id: string;
  text: string;
  partNumber: QuestionPartNumber;
}
