import { getDummyVisitCurrentQuestions } from "../util/utils";
import { magnetDevices, projects } from "./form_data";

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
  FANTOM_NEW,
  FANTOM_DONE,
}

interface IProjectInfo {
  projectId: string;
  projectName: string | null;
  magnetDeviceId: string;
  magnetDeviceName: string | null;
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
  visualCorrectionValue: number;
  sideDominance: string; // TODO: this should most probably be an enum
  email: string;
  phoneNumber: string; // TODO: this depends whether they want to choose national phone prefix..
}

export interface IAnswer {
  questionId: string;
  isYes: boolean;
  comment: string;
}

const idCounter = {
  freeId: "1",
};

const generateId = (): string => {
  const id = idCounter.freeId;
  idCounter.freeId = `${+id + 1}`;
  return id;
};

const loadAnswers = (answers: IAnswer[], visitState: VisitState): IAnswer[] =>
  answers.map((answer) => ({
    ...answer,
    comment:
      ![VisitState.NEW, VisitState.FANTOM_NEW].includes(visitState) && answer.isYes && answer.comment === ""
        ? "Komentář"
        : "",
  }));

export const createVisit = (initialVisit: IProbandVisit, state: VisitState): IProbandVisit => {
  const newId: string = generateId();
  return {
    ...initialVisit,
    id: newId,
    visitId: `${initialVisit.projectInfo.isFantom ? "fantom" : "visit"}${newId}`,
    state,
    projectInfo: { ...initialVisit.projectInfo },
    probandInfo: { ...initialVisit.probandInfo },
    answersPart1: { ...loadAnswers(initialVisit.answersPart1, state) },
    answersPart2: { ...loadAnswers(initialVisit.answersPart2, state) },
  };
};

const createVisits = (initialVisit: IProbandVisit, state: VisitState, count: number): IProbandVisit[] => {
  const visits = [];

  for (let i = 0; i < count; i++) {
    const newVisit = createVisit(initialVisit, state);
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
    magnetDeviceName: magnetDevices[0],
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
    visualCorrection: "Ne",
    visualCorrectionValue: 0,
    sideDominance: "Pravák",
    email: "karel.novak@email.cz",
    phoneNumber: "",
  },
  answersPart1: getDummyVisitCurrentQuestions(1).map((question, i) => ({
    questionId: question.id,
    isYes: i % 4 === 3,
    comment: "",
  })),
  answersPart2: getDummyVisitCurrentQuestions(2).map((question, i) => ({
    questionId: question.id,
    isYes: i % 6 === 0,
    comment: "",
  })),
};

export const dummyFantomVisitNew: IProbandVisit = {
  id: generateId(),
  visitId: "fantom123",
  state: VisitState.FANTOM_NEW,
  pdf: "/dummy.pdf",
  projectInfo: {
    projectId: "",
    projectName: null,
    magnetDeviceId: "",
    magnetDeviceName: null,
    isFantom: true,
    measurementDate: new Date(),
  },
  probandInfo: {
    name: "",
    surname: "",
    personalId: "",
    birthdate: new Date(),
    height: 1,
    weight: 1,
    gender: "Jiné",
    nativeLanguage: "Čeština",
    visualCorrection: "Ne",
    visualCorrectionValue: 0,
    sideDominance: "Neurčeno",
    email: "",
    phoneNumber: "",
  },
  answersPart1: getDummyVisitCurrentQuestions(1).map((question) => ({
    questionId: question.id,
    isYes: false,
    comment: "",
  })),
  answersPart2: getDummyVisitCurrentQuestions(2).map((question) => ({
    questionId: question.id,
    isYes: false,
    comment: "",
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
    name: "Fantom",
    surname: "Fantom",
    gender: "Jiné",
  },
  answersPart1: [...loadAnswers(dummyFantomVisitNew.answersPart1, VisitState.FANTOM_DONE)],
  answersPart2: [...loadAnswers(dummyFantomVisitNew.answersPart2, VisitState.FANTOM_DONE)],
};

export const dummyVisits: IProbandVisit[] = [
  dummyVisitNew,
  ...createVisits(dummyVisitNew, VisitState.NEW, 3),
  ...createVisits(dummyVisitNew, VisitState.CHECKED, 4),
  ...createVisits(dummyVisitNew, VisitState.SIGNED, 2),
  dummyFantomVisitNew,
  dummyFantomVisit,
  ...createVisits(dummyFantomVisit, VisitState.FANTOM_NEW, 1),
  ...createVisits(dummyFantomVisit, VisitState.FANTOM_DONE, 2),
];
