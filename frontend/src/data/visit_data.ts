import { questions1, questions2 } from "./form_data";

export interface IProbandVisit {
  id: string;
  visitId: string;
  state: VisitState;
  pdf: string;
  projectInfo: IProjectInfo;
  probandInfo: IProbandInfo;
  answersPart1: IAnswer[];
  answersPart2: IAnswer[];
}

export enum VisitState {
  NEW,
  CHECKED,
  SIGNED,
  DELETED,
}

interface IProjectInfo {
  projectId: string;
  magnetId: string;
  isFantom: boolean;
  measurementDate: Date;
}

interface IProbandInfo {
  name: string;
  surname: string;
  personalId: string;
  birthdate: Date;
  height: number;
  weight: number;
  gender: string; // TODO: can be enum or object stored in the database in case of future additions/editations etc.
  nativeLanguage: string; // TODO: can be enum or object stored in the database in case of future additions/editations etc.
  visualCorrection: string; // TODO: can be enum or object stored in the database in case of future additions/editations etc.
  sideDominance: string; // TODO: this should most probably be an enum
  mail?: string;
  phone?: string; // TODO: this depends whether they want to choose national phone prefix..
}

interface IAnswer {
  questionId: string;
  isYes: boolean;
}

export const dummyVisit: IProbandVisit = {
  id: "1",
  visitId: "visit123",
  state: VisitState.NEW,
  pdf: "/dummy-multipage.pdf",
  projectInfo: {
    projectId: "1",
    magnetId: "1",
    isFantom: false,
    measurementDate: new Date(),
  },
  probandInfo: {
    name: "Karel",
    surname: "Novák",
    personalId: "123456789",
    birthdate: new Date(),
    height: 180,
    weight: 85,
    gender: "Muž",
    nativeLanguage: "Čeština",
    visualCorrection: "Žádná",
    sideDominance: "Pravák",
    mail: "karel.novak@email.cz",
  },
  answersPart1: questions1.map((question, i) => ({
    questionId: question.id,
    isYes: i % 4 === 3,
  })),
  answersPart2: questions2.map((question, i) => ({
    questionId: question.id,
    isYes: i % 6 === 0,
  })),
};

export const dummyFantomVisit: IProbandVisit = {
  id: "2",
  visitId: "fantom123",
  state: VisitState.SIGNED,
  pdf: "/dummy.pdf",
  projectInfo: {
    ...dummyVisit.projectInfo,
    isFantom: true,
  },
  probandInfo: {
    ...dummyVisit.probandInfo,
    gender: "Jiné",
  },
  answersPart1: questions1.map((question) => ({
    questionId: question.id,
    isYes: false,
  })),
  answersPart2: questions2.map((question) => ({
    questionId: question.id,
    isYes: false,
  })),
};

export const dummyVisits: IProbandVisit[] = [dummyVisit, dummyFantomVisit];
