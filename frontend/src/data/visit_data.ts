import { QuestionPartNumber } from "@interfaces/question";
import { AnswerOption, Gender, IQac, IVisit, SideDominance, VisitState, VisualCorrection } from "@interfaces/visit";
import { getDummyVisitCurrentQuestions } from "@util/fetch.dev";
import { devicesDev, projectsDev } from "./form_data";

const idCounter = {
  freeId: "1",
};

const generateId = (): string => {
  const id = idCounter.freeId;
  idCounter.freeId = `${+id + 1}`;
  return id;
};

const loadAnswers = (answers: IQac[], visitState: VisitState): IQac[] =>
  answers.map((answer) => {
    let comment = answer.comment.trim().length > 0 ? answer.comment : "";

    if (
      answer.answer === AnswerOption.YES
      && ((VisitState.IN_APPROVAL && answer.partNumber === QuestionPartNumber.ONE)
        || [VisitState.APPROVED, VisitState.DISAPPROVED, VisitState.FOR_SIGNATURE, VisitState.SIGNED].includes(visitState))
    ) {
      comment = "Komentář";
    }

    return {
      ...answer,
      // For dev data purposes – approved visit must have some comment to a question answered with 'yes'
      comment,
    };
  });

export const createVisit = (initialVisit: IVisit, state: VisitState): IVisit => {
  const newId: string = generateId();
  return {
    ...initialVisit,
    id: newId,
    createdAt: new Date(+`16630${+newId % 10}0000000`),
    visitId: `${initialVisit.projectInfo.isPhantom ? "phantom" : "visit"}${newId}`,
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
    visitId: `${initialVisit.projectInfo.isPhantom ? "phantom" : "visit"}${newId}`,
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

const dummyVisitNew: IVisit = {
  id: generateId(),
  createdAt: new Date(1663390000000),
  visitId: "visit1",
  state: VisitState.NEW,
  pdf: "/dummy-multipage.pdf",
  projectInfo: {
    projectId: "1",
    project: projectsDev[0],
    deviceId: "1",
    device: devicesDev[0],
    isPhantom: false,
    measurementDate: new Date(),
    disapprovalReason: null,
  },
  probandInfo: {
    name: "Karel",
    surname: "Novák",
    personalId: "123456789",
    birthdate: new Date(),
    height: 180,
    weight: 85,
    gender: Gender.MALE,
    nativeLanguage: "Čeština",
    visualCorrection: VisualCorrection.NO,
    visualCorrectionValue: 0,
    sideDominance: SideDominance.RIGHT_HANDED,
    email: "karel.novak@email.cz",
    phone: "123456789",
  },
  answers: getDummyVisitCurrentQuestions().map((question, i) => ({
    questionId: question.id,
    partNumber: question.partNumber,
    answer: i % 5 === 4 ? AnswerOption.YES : AnswerOption.NO,
    comment: "",
  })),
};

const dummyPhantomVisitNew: IVisit = {
  id: generateId(),
  createdAt: new Date(1663700000000),
  visitId: "phantom123",
  state: VisitState.NEW,
  pdf: "/dummy.pdf",
  projectInfo: {
    projectId: "",
    project: null,
    deviceId: "",
    device: null,
    isPhantom: true,
    measurementDate: new Date(),
    disapprovalReason: null,
  },
  probandInfo: {
    name: "Phantom 1",
    surname: "Phantom 1",
    personalId: "123456789",
    birthdate: new Date(),
    height: 1,
    weight: 1,
    gender: Gender.OTHER,
    nativeLanguage: "Čeština",
    visualCorrection: VisualCorrection.NO,
    visualCorrectionValue: 0,
    sideDominance: SideDominance.UNDETERMINED,
    email: "",
    phone: "",
  },
  answers: getDummyVisitCurrentQuestions().map((question) => ({
    questionId: question.id,
    partNumber: question.partNumber,
    answer: AnswerOption.NO,
    comment: "",
  })),
};

const dummyPhantomVisit: IVisit = {
  id: generateId(),
  createdAt: new Date(1663000000000),
  visitId: "phantom2",
  state: VisitState.SIGNED,
  pdf: "/dummy.pdf",
  projectInfo: {
    ...dummyVisitNew.projectInfo,
    isPhantom: true,
  },
  probandInfo: {
    ...dummyVisitNew.probandInfo,
    name: "Phantom",
    surname: "Phantom",
    gender: Gender.OTHER,
  },
  answers: [...loadAnswers(dummyPhantomVisitNew.answers, VisitState.SIGNED)],
};

export const dummyVisits: IVisit[] = [
  dummyVisitNew,
  ...createVisits(dummyVisitNew, VisitState.NEW, 3),
  ...createVisits(dummyVisitNew, VisitState.IN_APPROVAL, 2),
  ...createVisits(dummyVisitNew, VisitState.DISAPPROVED, 3),
  ...createVisits(dummyVisitNew, VisitState.APPROVED, 4),
  ...createVisits(dummyVisitNew, VisitState.SIGNED, 2),
  dummyPhantomVisit,
  ...createVisits(dummyPhantomVisit, VisitState.SIGNED, 2),
];
