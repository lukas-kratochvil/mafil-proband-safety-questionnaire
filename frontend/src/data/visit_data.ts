import { QuestionPartNumber } from "@app/model/question";
import { AnswerOption, IQac, IVisit, VisitStateDEV, VisualCorrection } from "@app/model/visit";
import { getDummyVisitCurrentQuestions } from "@app/util/fetch.dev";
import { devicesDev, projectsDev } from "./form_data";
import { genders, handednesses, nativeLanguages } from "./translated_entities_data";

const idCounter = {
  freeId: "1",
};

const generateId = (): string => {
  const id = idCounter.freeId;
  idCounter.freeId = `${+id + 1}`;
  return id;
};

const loadAnswers = (answers: IQac[], visitState: VisitStateDEV): IQac[] =>
  answers.map((answer) => {
    let comment = answer.comment.trim().length > 0 ? answer.comment : "";

    if (
      answer.answer === AnswerOption.YES
      && ((VisitStateDEV.IN_APPROVAL && answer.partNumber === QuestionPartNumber.ONE)
        || [VisitStateDEV.APPROVED, VisitStateDEV.DISAPPROVED, VisitStateDEV.FOR_SIGNATURE, VisitStateDEV.SIGNED].includes(
          visitState
        ))
    ) {
      comment = "Komentář";
    }

    return {
      ...answer,
      // For dev data purposes – approved visit must have some comment to a question answered with 'yes'
      comment,
    };
  });

export const createVisit = (initialVisit: IVisit, state: VisitStateDEV): IVisit => {
  const newId: string = generateId();
  return {
    ...initialVisit,
    id: newId,
    createdAt: new Date(+`16630${+newId % 10}0000000`),
    visitId: `${initialVisit.projectInfo.isPhantom ? "phantom" : "visit"}${newId}`,
    state,
    projectInfo:
      state === VisitStateDEV.NEW
        ? {
            ...initialVisit.projectInfo,
            projectAcronym: null,
            deviceName: null,
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
    state: VisitStateDEV.NEW,
    projectInfo: { ...initialVisit.projectInfo },
    probandInfo: { ...initialVisit.probandInfo },
    answers: [...initialVisit.answers],
  };
};

const createVisits = (initialVisit: IVisit, state: VisitStateDEV, count: number): IVisit[] => {
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
  state: VisitStateDEV.NEW,
  pdf: "/dummy-multipage.pdf",
  projectInfo: {
    projectId: projectsDev[0].id,
    projectAcronym: projectsDev[0].acronym,
    deviceId: devicesDev[0].id,
    deviceName: devicesDev[0].name,
    isPhantom: false,
    measuredAt: new Date(),
    disapprovalReason: null,
  },
  probandInfo: {
    name: "Karel",
    surname: "Novák",
    personalId: "123456789",
    birthdate: new Date(),
    heightCm: 180,
    weightKg: 85,
    gender: genders[0],
    nativeLanguage: nativeLanguages[0],
    visualCorrection: VisualCorrection.NO,
    visualCorrectionDioptre: 0,
    handedness: handednesses[0],
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
  state: VisitStateDEV.NEW,
  pdf: "/dummy.pdf",
  projectInfo: {
    projectId: "",
    projectAcronym: null,
    deviceId: "",
    deviceName: null,
    isPhantom: true,
    measuredAt: new Date(),
    disapprovalReason: null,
  },
  probandInfo: {
    name: "Phantom 1",
    surname: "Phantom 1",
    personalId: "123456789",
    birthdate: new Date(),
    heightCm: 1,
    weightKg: 1,
    gender: genders[2],
    nativeLanguage: nativeLanguages[0],
    visualCorrection: VisualCorrection.NO,
    visualCorrectionDioptre: 0,
    handedness: handednesses[3],
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
  state: VisitStateDEV.SIGNED,
  pdf: "/dummy.pdf",
  projectInfo: {
    ...dummyVisitNew.projectInfo,
    isPhantom: true,
  },
  probandInfo: {
    ...dummyVisitNew.probandInfo,
    name: "Phantom",
    surname: "Phantom",
    gender: genders[2],
  },
  answers: [...loadAnswers(dummyPhantomVisitNew.answers, VisitStateDEV.SIGNED)],
};

export const dummyVisits: IVisit[] = [
  dummyVisitNew,
  ...createVisits(dummyVisitNew, VisitStateDEV.NEW, 3),
  ...createVisits(dummyVisitNew, VisitStateDEV.IN_APPROVAL, 2),
  ...createVisits(dummyVisitNew, VisitStateDEV.DISAPPROVED, 3),
  ...createVisits(dummyVisitNew, VisitStateDEV.APPROVED, 4),
  ...createVisits(dummyVisitNew, VisitStateDEV.SIGNED, 2),
  dummyPhantomVisit,
  ...createVisits(dummyPhantomVisit, VisitStateDEV.SIGNED, 2),
];
