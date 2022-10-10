import { getDummyVisitCurrentQuestions } from "../util/fetch.dev";
import { devicesDev, projectsDev } from "./form_data";
import { QuestionPartNumber } from "./question_data";

export enum VisitState {
  NEW = "Nové",
  IN_APPROVAL = "Ve schvalování",
  APPROVED = "Schváleno",
  DISAPPROVED = "Neschváleno",
  FOR_SIGNATURE = "K podpisu",
  SIGNED = "Podepsáno",
  DELETED = "Smazáno",
}

export interface IVisit {
  id: string;
  createdAt: Date;
  visitId: string;
  state: VisitState;
  pdf: string;
  projectInfo: IProjectInfo;
  probandInfo: IProbandInfo;
  answers: IQac[];
}

interface IProjectInfo {
  projectId: string;
  project: string | null;
  magnetDeviceId: string;
  device: string | null;
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
  gender: string; // TODO: should be enum
  nativeLanguage: string; // TODO: object stored in the database
  visualCorrection: string; // TODO: should be enum
  visualCorrectionValue: number;
  sideDominance: string; // TODO: should be enum
  email: string;
  phoneNumber: string;
}

type AnswerOptionsType = "yes" | "no" | undefined;

export interface IQac {
  questionId: string;
  partNumber: QuestionPartNumber;
  answer: AnswerOptionsType;
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

const loadAnswers = (answers: IQac[], visitState: VisitState): IQac[] =>
  answers.map((answer) => ({
    ...answer,
    comment:
      // For dev data purposes – approved visit must have some comment to a question answered with 'yes'
      [VisitState.APPROVED, VisitState.FOR_SIGNATURE, VisitState.SIGNED].includes(visitState)
      && answer.answer === "yes"
      && answer.comment === ""
        ? "Komentář"
        : "",
  }));

export const createVisit = (initialVisit: IVisit, state: VisitState): IVisit => {
  const newId: string = generateId();
  return {
    ...initialVisit,
    id: newId,
    createdAt: new Date(+`16630${+newId % 10}0000000`),
    visitId: `${initialVisit.projectInfo.isFantom ? "fantom" : "visit"}${newId}`,
    state,
    projectInfo:
      state === VisitState.NEW
        ? {
            ...initialVisit.projectInfo,
            project: null,
            device: null,
          }
        : {
            ...initialVisit.projectInfo,
          },
    probandInfo: {
      ...initialVisit.probandInfo,
      birthdate: new Date((initialVisit.probandInfo.birthdate.valueOf() % 1000000000) + +newId * 10000000),
    },
    answers: [...loadAnswers(initialVisit.answers, state)],
  };
};

export const duplicateVisit = (initialVisit: IVisit): IVisit => {
  const newId: string = generateId();
  return {
    ...initialVisit,
    id: newId,
    visitId: `${initialVisit.projectInfo.isFantom ? "fantom" : "visit"}${newId}`,
    state: VisitState.NEW,
    projectInfo: { ...initialVisit.projectInfo },
    probandInfo: { ...initialVisit.probandInfo },
    answers: [...initialVisit.answers],
  };
};

const createVisits = (initialVisit: IVisit, state: VisitState, count: number): IVisit[] => {
  const visits = [];

  for (let i = 0; i < count; i++) {
    const newVisit = createVisit(initialVisit, state);
    visits.push(newVisit);
  }

  return visits;
};

export const dummyVisitNew: IVisit = {
  id: generateId(),
  createdAt: new Date(1663390000000),
  visitId: "visit1",
  state: VisitState.NEW,
  pdf: "/dummy-multipage.pdf",
  projectInfo: {
    projectId: "1",
    project: projectsDev[0],
    magnetDeviceId: "1",
    device: devicesDev[0],
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
  answers: getDummyVisitCurrentQuestions().map((question, i) => ({
    questionId: question.id,
    partNumber: question.partNumber,
    answer: i % 5 === 4 ? "yes" : "no",
    comment: "",
  })),
};

const dummyFantomVisitNew: IVisit = {
  id: generateId(),
  createdAt: new Date(1663700000000),
  visitId: "fantom123",
  state: VisitState.NEW,
  pdf: "/dummy.pdf",
  projectInfo: {
    projectId: "",
    project: null,
    magnetDeviceId: "",
    device: null,
    isFantom: true,
    measurementDate: new Date(),
  },
  probandInfo: {
    name: "Fantom 1",
    surname: "Fantom 1",
    personalId: "123456789",
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
  answers: getDummyVisitCurrentQuestions().map((question) => ({
    questionId: question.id,
    partNumber: question.partNumber,
    answer: "no",
    comment: "",
  })),
};

export const dummyFantomVisit: IVisit = {
  id: generateId(),
  createdAt: new Date(1663000000000),
  visitId: "fantom2",
  state: VisitState.SIGNED,
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
  answers: [...loadAnswers(dummyFantomVisitNew.answers, VisitState.SIGNED)],
};

export const dummyVisits: IVisit[] = [
  dummyVisitNew,
  ...createVisits(dummyVisitNew, VisitState.NEW, 3),
  ...createVisits(dummyVisitNew, VisitState.IN_APPROVAL, 2),
  ...createVisits(dummyVisitNew, VisitState.DISAPPROVED, 3),
  ...createVisits(dummyVisitNew, VisitState.APPROVED, 4),
  ...createVisits(dummyVisitNew, VisitState.SIGNED, 2),
  dummyFantomVisit,
  ...createVisits(dummyFantomVisit, VisitState.SIGNED, 2),
];
