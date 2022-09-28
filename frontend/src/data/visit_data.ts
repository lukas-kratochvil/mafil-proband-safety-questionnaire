import { AnswerOptionsType } from "../components/form/FormQuestions";
import { getDummyVisitCurrentQuestions } from "../util/utils.dev";
import { devices, projects } from "./form_data";
import { QuestionPartNumber } from "./question_data";

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

export enum VisitState {
  NEW,
  CHECKED,
  SIGN_CHOSEN,
  SIGNED,
  FANTOM_NEW,
  FANTOM_DONE,
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
  gender: string; // TODO: can be enum or object stored in the database in case of future additions/editations etc.
  nativeLanguage: string; // TODO: can be enum or object stored in the database in case of future additions/editations etc.
  visualCorrection: string; // TODO: can be enum or object stored in the database in case of future additions/editations etc.
  visualCorrectionValue: number;
  sideDominance: string; // TODO: this should most probably be an enum
  email: string;
  phoneNumber: string; // TODO: this depends whether they want to choose national phone prefix..
}

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
      ![VisitState.NEW, VisitState.FANTOM_NEW].includes(visitState) && answer.answer === "yes" && answer.comment === ""
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
    state: initialVisit.projectInfo.isFantom ? VisitState.FANTOM_NEW : VisitState.NEW,
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
    project: projects[0],
    magnetDeviceId: "1",
    device: devices[0],
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

export const dummyFantomVisitNew: IVisit = {
  id: generateId(),
  createdAt: new Date(1663700000000),
  visitId: "fantom123",
  state: VisitState.FANTOM_NEW,
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
  answers: [...loadAnswers(dummyFantomVisitNew.answers, VisitState.FANTOM_DONE)],
};

export const dummyVisits: IVisit[] = [
  dummyVisitNew,
  ...createVisits(dummyVisitNew, VisitState.NEW, 3),
  ...createVisits(dummyVisitNew, VisitState.CHECKED, 4),
  ...createVisits(dummyVisitNew, VisitState.SIGNED, 2),
  dummyFantomVisitNew,
  dummyFantomVisit,
  ...createVisits(dummyFantomVisit, VisitState.FANTOM_NEW, 1),
  ...createVisits(dummyFantomVisit, VisitState.FANTOM_DONE, 2),
];
