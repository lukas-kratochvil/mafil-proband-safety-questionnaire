import { gendersDev } from "@app/__tests__/data/genders";
import { handednessesDev } from "@app/__tests__/data/handednesses";
import { nativeLanguagesDev } from "@app/__tests__/data/native-languages";
import { operatorMRDev } from "@app/__tests__/data/operators";
import { AnswerOption } from "@app/model/form";
import { IDuplicatedVisitIncludingQuestions, VisualCorrection } from "@app/model/visit";
import { VisitState } from "@app/util/mafildb_API/dto";
import {
  IApprovalRoomVisitFormIncludingQuestionsDTO,
  IWaitingRoomVisitFormIncludingQuestions,
  QuestionPartNumber,
  VisitFormAnswerIncludingQuestion,
} from "@app/util/server_API/dto";
import {
  loadEmptyDefaultValues,
  loadFormDefaultValuesFromApprovalRoomVisitForm,
  loadFormDefaultValuesFromWaitingRoomVisitForm,
  loadFormDefaultValuesVisitDuplication,
  loadPhantomFormDefaultValues,
} from "../loaders";

const answerIncludingQuestion: VisitFormAnswerIncludingQuestion = {
  questionId: "1",
  updatedAt: new Date(),
  answer: AnswerOption.NO,
  comment: "",
  partNumber: QuestionPartNumber.ONE,
  mustBeApproved: false,
  order: 1,
  hiddenByGenders: [],
  translations: [],
};

const waitingRoomVisitForm: IWaitingRoomVisitFormIncludingQuestions = {
  id: "123",
  state: "NEW",
  probandLanguageCode: "cs",
  name: "Name",
  surname: "Surname",
  personalId: "000000",
  birthdate: new Date(),
  gender: gendersDev[0],
  nativeLanguage: nativeLanguagesDev[2],
  heightCm: 180,
  weightKg: 80,
  visualCorrectionDioptre: 1,
  handedness: handednessesDev[3],
  email: "name.surname@email.com",
  phone: "123456789",
  answersIncludingQuestions: [answerIncludingQuestion],
};

const approvalRoomVisitForm: IApprovalRoomVisitFormIncludingQuestionsDTO = {
  ...waitingRoomVisitForm,
  answersIncludingQuestions: [{ ...answerIncludingQuestion, comment: "comment" }],
  additionalInfo: {
    projectId: "1552314",
    projectAcronym: "Proj1",
    deviceId: "6552515",
    deviceName: "M1",
    measuredAt: new Date(),
    finalizer: operatorMRDev,
    finalizedAt: new Date(),
  },
};

const duplicatedVisit: IDuplicatedVisitIncludingQuestions = {
  visitId: "1",
  date: new Date(),
  isPhantom: false,
  state: VisitState.APPROVED,
  measurementDate: new Date(),
  probandLanguageCode: "cs",
  name: "Name",
  surname: "Surname",
  personalId: "000000",
  birthdate: new Date(),
  gender: gendersDev[0],
  nativeLanguage: nativeLanguagesDev[2],
  heightCm: 180,
  weightKg: 80,
  visualCorrectionDioptre: 1,
  handedness: handednessesDev[3],
  email: "name.surname@email.com",
  phone: "123456789",
  answersIncludingQuestions: [answerIncludingQuestion],
};

const visitNotCompleted: IDuplicatedVisitIncludingQuestions = {
  visitId: "1",
  date: new Date(),
  isPhantom: false,
  state: VisitState.APPROVED,
  probandLanguageCode: "cs",
  measurementDate: new Date(),
  name: "Name",
  surname: "Surname",
  personalId: "000000",
  birthdate: new Date(),
  gender: gendersDev[0],
  nativeLanguage: nativeLanguagesDev[2],
  heightCm: 180,
  weightKg: 80,
  visualCorrectionDioptre: 0,
  handedness: handednessesDev[3],
  email: "",
  phone: "",
  answersIncludingQuestions: [answerIncludingQuestion],
};

describe("form loaders", () => {
  test("empty form default values", () => {
    const emptyFormDefaultValues = loadEmptyDefaultValues();

    expect(emptyFormDefaultValues.project).toBeNull();
    expect(emptyFormDefaultValues.device).toBeNull();
    expect(emptyFormDefaultValues.measuredAt).toBeNull();
    expect(emptyFormDefaultValues.name).toBe("");
    expect(emptyFormDefaultValues.surname).toBe("");
    expect(emptyFormDefaultValues.personalId).toBe("");
    expect(emptyFormDefaultValues.birthdate).toBeNull();
    expect(emptyFormDefaultValues.gender).toBeNull();
    expect(emptyFormDefaultValues.nativeLanguage).toBeNull();
    expect(emptyFormDefaultValues.heightCm).toBe("");
    expect(emptyFormDefaultValues.weightKg).toBe("");
    expect(emptyFormDefaultValues.handedness).toBeNull();
    expect(emptyFormDefaultValues.visualCorrection).toBeNull();
    expect(emptyFormDefaultValues.visualCorrectionDioptre).toEqual(0);
    expect(emptyFormDefaultValues.email).toBe("");
    expect(emptyFormDefaultValues.phone).toBe("");
    expect(emptyFormDefaultValues.answers).toEqual([]);
  });

  test("phantom form default values", () => {
    const currentDate = new Date();
    vi.spyOn(global, "Date").mockImplementationOnce(() => currentDate as unknown as string);

    const phantomFormDefaultValues = loadPhantomFormDefaultValues();

    expect(phantomFormDefaultValues.project).toBeNull();
    expect(phantomFormDefaultValues.device).toBeNull();
    expect(phantomFormDefaultValues.measuredAt).toEqual(currentDate);
    expect(phantomFormDefaultValues.name).toEqual("");
    expect(phantomFormDefaultValues.surname).toBe("");
    expect(phantomFormDefaultValues.personalId).toBe("");
    expect(phantomFormDefaultValues.birthdate).toBeNull();
    expect(phantomFormDefaultValues.gender).toBeNull(); // is set to 'Other' in the FormProbandInfo component
    expect(phantomFormDefaultValues.nativeLanguage).toBeNull();
    expect(phantomFormDefaultValues.heightCm).toBe("");
    expect(phantomFormDefaultValues.weightKg).toBe("");
    expect(phantomFormDefaultValues.handedness).toBeNull();
    expect(phantomFormDefaultValues.visualCorrection).toBeNull();
    expect(phantomFormDefaultValues.visualCorrectionDioptre).toEqual(0);
    expect(phantomFormDefaultValues.email).toBe("");
    expect(phantomFormDefaultValues.phone).toBe("");
    expect(phantomFormDefaultValues.answers).toEqual([]);
  });

  test("waiting room visit form default values", () => {
    const fetchedVisit = waitingRoomVisitForm;
    const loadedFormValues = loadFormDefaultValuesFromWaitingRoomVisitForm(fetchedVisit);

    expect(loadedFormValues.name).toEqual(fetchedVisit.name);
    expect(loadedFormValues.surname).toEqual(fetchedVisit.surname);
    expect(loadedFormValues.personalId).toEqual(fetchedVisit.personalId);
    expect(loadedFormValues.birthdate).toEqual(fetchedVisit.birthdate);
    expect(loadedFormValues.gender?.id).toEqual(fetchedVisit.gender.id);
    expect(loadedFormValues.nativeLanguage?.id).toEqual(fetchedVisit.nativeLanguage.id);
    expect(loadedFormValues.heightCm).toEqual(fetchedVisit.heightCm);
    expect(loadedFormValues.weightKg).toEqual(fetchedVisit.weightKg);
    expect(loadedFormValues.handedness?.id).toEqual(fetchedVisit.handedness.id);
    expect(loadedFormValues.visualCorrection?.value).toEqual(
      fetchedVisit.visualCorrectionDioptre === 0 ? VisualCorrection.NO : VisualCorrection.YES
    );
    expect(loadedFormValues.visualCorrectionDioptre).toEqual(fetchedVisit.visualCorrectionDioptre);
    expect(loadedFormValues.email).toEqual(fetchedVisit.email);
    expect(loadedFormValues.phone).toEqual(fetchedVisit.phone);
    loadedFormValues.answers.forEach((loadedAnswer, i) => {
      expect(loadedAnswer.answer).toEqual(fetchedVisit.answersIncludingQuestions[i].answer);
      expect(loadedAnswer.questionId).toEqual(fetchedVisit.answersIncludingQuestions[i].questionId);
      expect(loadedAnswer.comment).toEqual("");
    });
  });

  test("approval room visit form default values", () => {
    const fetchedVisit = approvalRoomVisitForm;
    const loadedFormValues = loadFormDefaultValuesFromApprovalRoomVisitForm(fetchedVisit);

    expect(loadedFormValues.project?.id).toEqual(fetchedVisit.additionalInfo.projectId); // project is loaded in the FormProjectInfo component using the projectId
    expect(loadedFormValues.device?.id).toEqual(fetchedVisit.additionalInfo.deviceId); // device is loaded in the FormProjectInfo component using the deviceId
    expect(loadedFormValues.measuredAt).toEqual(fetchedVisit.additionalInfo.measuredAt);
    expect(loadedFormValues.name).toEqual(fetchedVisit.name);
    expect(loadedFormValues.surname).toEqual(fetchedVisit.surname);
    expect(loadedFormValues.personalId).toEqual(fetchedVisit.personalId);
    expect(loadedFormValues.birthdate).toEqual(fetchedVisit.birthdate);
    expect(loadedFormValues.gender?.id).toEqual(fetchedVisit.gender.id);
    expect(loadedFormValues.nativeLanguage?.id).toEqual(fetchedVisit.nativeLanguage.id);
    expect(loadedFormValues.heightCm).toEqual(fetchedVisit.heightCm);
    expect(loadedFormValues.weightKg).toEqual(fetchedVisit.weightKg);
    expect(loadedFormValues.handedness?.id).toEqual(fetchedVisit.handedness.id);
    expect(loadedFormValues.visualCorrection?.value).toEqual(
      fetchedVisit.visualCorrectionDioptre === 0 ? VisualCorrection.NO : VisualCorrection.YES
    );
    expect(loadedFormValues.visualCorrectionDioptre).toEqual(fetchedVisit.visualCorrectionDioptre);
    expect(loadedFormValues.email).toEqual(fetchedVisit.email);
    expect(loadedFormValues.phone).toEqual(fetchedVisit.phone);
    loadedFormValues.answers.forEach((loadedAnswer, i) => {
      expect(loadedAnswer.answer).toEqual(fetchedVisit.answersIncludingQuestions[i].answer);
      expect(loadedAnswer.questionId).toEqual(fetchedVisit.answersIncludingQuestions[i].questionId);
      expect(loadedAnswer.comment).toEqual(fetchedVisit.answersIncludingQuestions[i].comment);
    });
  });

  test("duplicated visit form default values", () => {
    const currentDate = new Date();
    vi.spyOn(global, "Date").mockImplementationOnce(() => currentDate as unknown as string);

    const formDefaultValuesVisitDuplication = loadFormDefaultValuesVisitDuplication(duplicatedVisit);

    expect(formDefaultValuesVisitDuplication.project).toBeNull();
    expect(formDefaultValuesVisitDuplication.device).toBeNull();
    expect(formDefaultValuesVisitDuplication.measuredAt).toEqual(currentDate);
    expect(formDefaultValuesVisitDuplication.name).toEqual(duplicatedVisit.name);
    expect(formDefaultValuesVisitDuplication.surname).toEqual(duplicatedVisit.surname);
    expect(formDefaultValuesVisitDuplication.personalId).toEqual(duplicatedVisit.personalId);
    expect(formDefaultValuesVisitDuplication.birthdate).toEqual(duplicatedVisit.birthdate);
    expect(formDefaultValuesVisitDuplication.gender?.id).toEqual(duplicatedVisit.gender.id);
    expect(formDefaultValuesVisitDuplication.nativeLanguage).toEqual(duplicatedVisit.nativeLanguage);
    expect(formDefaultValuesVisitDuplication.heightCm).toEqual(duplicatedVisit.heightCm);
    expect(formDefaultValuesVisitDuplication.weightKg).toEqual(duplicatedVisit.weightKg);
    expect(formDefaultValuesVisitDuplication.handedness?.id).toEqual(duplicatedVisit.handedness.id);
    expect(formDefaultValuesVisitDuplication.visualCorrection?.value).toEqual(
      duplicatedVisit.visualCorrectionDioptre === 0 ? VisualCorrection.NO : VisualCorrection.YES
    );
    expect(formDefaultValuesVisitDuplication.visualCorrectionDioptre).toEqual(duplicatedVisit.visualCorrectionDioptre);
    expect(formDefaultValuesVisitDuplication.email).toEqual(duplicatedVisit.email);
    expect(formDefaultValuesVisitDuplication.phone).toEqual(duplicatedVisit.phone);

    formDefaultValuesVisitDuplication.answers.forEach((answer, i) => {
      expect(answer.questionId).toEqual(visitNotCompleted.answersIncludingQuestions[i].questionId);
      expect(answer.mustBeApproved).toEqual(visitNotCompleted.answersIncludingQuestions[i].mustBeApproved);
      expect(answer.answer).toEqual(visitNotCompleted.answersIncludingQuestions[i].answer);
      expect(answer.comment).toEqual(visitNotCompleted.answersIncludingQuestions[i].comment);
    });
  });
});
