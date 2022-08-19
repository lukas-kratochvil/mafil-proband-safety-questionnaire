export interface IProbandVisit {
  id: string;
  visitId: string;
  state: VisitState;
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
  answersPart1: [
    {
      questionId: "p1q01",
      isYes: false,
    },
    {
      questionId: "p1q02",
      isYes: false,
    },
    {
      questionId: "p1q03",
      isYes: false,
    },
    {
      questionId: "p1q04",
      isYes: false,
    },
    {
      questionId: "p1q05",
      isYes: false,
    },
    {
      questionId: "p1q06",
      isYes: false,
    },
    {
      questionId: "p1q07",
      isYes: false,
    },
    {
      questionId: "p1q08",
      isYes: false,
    },
    {
      questionId: "p1q09",
      isYes: false,
    },
    {
      questionId: "p1q10",
      isYes: false,
    },
    {
      questionId: "p1q11",
      isYes: false,
    },
    {
      questionId: "p1q12",
      isYes: false,
    },
    {
      questionId: "p1q13",
      isYes: false,
    },
  ],
  answersPart2: [
    {
      questionId: "p2q01",
      isYes: false,
    },
    {
      questionId: "p2q02",
      isYes: false,
    },
    {
      questionId: "p2q03",
      isYes: false,
    },
    {
      questionId: "p2q04",
      isYes: false,
    },
    {
      questionId: "p2q05",
      isYes: false,
    },
    {
      questionId: "p2q06",
      isYes: false,
    },
    {
      questionId: "p2q07",
      isYes: false,
    },
  ],
};
