export interface IPdfData {
  // phantom visit has operator name instead of the signature field
  finalizerId?: string;
  visitId: string;
  projectAcronym: string;
  measurementDate: Date;
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  gender: string;
  nativeLanguage: string;
  heightCm: number;
  weightKg: number;
  visualCorrectionDioptre: number;
  handedness: string;
  email?: string;
  phone?: string;
  answers?: IQuestionAnswer[];
}

interface IQuestionAnswer {
  questionText: string;
  answer: string;
  comment: string;
}
