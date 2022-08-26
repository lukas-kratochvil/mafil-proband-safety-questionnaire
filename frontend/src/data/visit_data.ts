import { magnets, projects, questions1, questions2 } from "./form_data";

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
  FANTOM_DONE,
}

interface IProjectInfo {
  projectId: string;
  projectName: string;
  magnetDeviceId: string;
  magnetDeviceName: string;
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
  sex: string; // TODO: can be enum or object stored in the database in case of future additions/editations etc.
  nativeLanguage: string; // TODO: can be enum or object stored in the database in case of future additions/editations etc.
  visualCorrection: string; // TODO: can be enum or object stored in the database in case of future additions/editations etc.
  visualCorrectionValue: number;
  sideDominance: string; // TODO: this should most probably be an enum
  email: string;
  phoneNumber: string; // TODO: this depends whether they want to choose national phone prefix..
}

interface IAnswer {
  questionId: string;
  isYes: boolean;
}

const idCounter = {
  freeId: "1",
};

const generateId = (): string => {
  const id = idCounter.freeId;
  idCounter.freeId = `${+id + 1}`;
  return id;
};

const createVisits = (initialVisit: IProbandVisit, state: VisitState, count: number): IProbandVisit[] => {
  const visits = [];

  for (let i = 0; i < count; i++) {
    const newId: string = generateId();
    const newVisit: IProbandVisit = {
      ...initialVisit,
      id: newId,
      visitId: `${initialVisit.projectInfo.isFantom ? "fantom" : "visit"}${newId}`,
      state,
      projectInfo: { ...initialVisit.projectInfo },
      probandInfo: { ...initialVisit.probandInfo },
      answersPart1: { ...initialVisit.answersPart1 },
      answersPart2: { ...initialVisit.answersPart2 },
    };
    visits.push(newVisit);
  }

  return visits;
};

export const dummyVisitNew: IProbandVisit = {
  id: generateId(),
  visitId: "visit1",
  state: VisitState.NEW,
  pdf: "/dummy-multipage.pdf",
  projectInfo: {
    projectId: "1",
    projectName: projects[0],
    magnetDeviceId: "1",
    magnetDeviceName: magnets[0],
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
    sex: "Muž",
    nativeLanguage: "Čeština",
    visualCorrection: "Ne",
    visualCorrectionValue: 0,
    sideDominance: "Pravák",
    email: "karel.novak@email.cz",
    phoneNumber: "",
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
  id: generateId(),
  visitId: "fantom2",
  state: VisitState.FANTOM_DONE,
  pdf: "/dummy.pdf",
  projectInfo: {
    ...dummyVisitNew.projectInfo,
    isFantom: true,
  },
  probandInfo: {
    ...dummyVisitNew.probandInfo,
    sex: "Jiné",
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

export const dummyVisits: IProbandVisit[] = [
  dummyVisitNew,
  ...createVisits(dummyVisitNew, VisitState.NEW, 3),
  ...createVisits(dummyVisitNew, VisitState.CHECKED, 4),
  ...createVisits(dummyVisitNew, VisitState.SIGNED, 2),
  dummyFantomVisit,
  ...createVisits(dummyFantomVisit, VisitState.NEW, 1),
  ...createVisits(dummyFantomVisit, VisitState.FANTOM_DONE, 2),
];
