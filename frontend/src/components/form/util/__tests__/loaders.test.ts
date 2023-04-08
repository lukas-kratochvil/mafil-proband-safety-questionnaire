import { genders, handednesses, nativeLanguages } from "@app/data/translated_entities_data";
import { AnswerOption } from "@app/model/form";
import { IVisit, VisitStateDEV, VisualCorrection } from "@app/model/visit";
import {
  IApprovalRoomVisitFormIncludingQuestionsDTO,
  IWaitingRoomVisitFormIncludingQuestionsDTO,
  QuestionPartNumber,
} from "@app/util/server_API/dto";
import {
  loadEmptyDefaultValues,
  loadFormDefaultValuesFromApprovalRoomVisitForm,
  loadFormDefaultValuesFromWaitingRoomVisitForm,
  loadFormDefaultValuesVisitDuplication,
  loadPhantomFormDefaultValues,
} from "../loaders";

const waitingRoomVisitForm: IWaitingRoomVisitFormIncludingQuestionsDTO = {
  id: "123",
  name: "Name",
  surname: "Surname",
  personalId: "000000",
  birthdate: new Date(),
  gender: genders[0],
  nativeLanguage: nativeLanguages[2],
  heightCm: 180,
  weightKg: 80,
  visualCorrectionDioptre: 1,
  handedness: handednesses[3],
  email: "name.surname@email.com",
  phone: "123456789",
  answersIncludingQuestions: [
    {
      answer: AnswerOption.NO,
      questionId: "1",
      partNumber: 1,
      mustBeApproved: false,
      hiddenByGenders: [],
      translations: [],
    },
  ],
};

const approvalRoomVisitForm: IApprovalRoomVisitFormIncludingQuestionsDTO = {
  ...waitingRoomVisitForm,
  answersIncludingQuestions: waitingRoomVisitForm.answersIncludingQuestions.map((answer) => ({
    ...answer,
    comment: "comment",
  })),
  additionalInfo: {
    projectId: "1552314",
    projectAcronym: "Proj1",
    deviceId: "6552515",
    deviceName: "M1",
    measuredAt: new Date(),
  },
};

const visit: IVisit = {
  id: "1",
  createdAt: new Date(),
  visitId: "1",
  pdf: "pdf",
  state: VisitStateDEV.APPROVED,
  name: "Name",
  surname: "Surname",
  personalId: "000000",
  birthdate: new Date(),
  gender: genders[0],
  nativeLanguage: nativeLanguages[2],
  heightCm: 180,
  weightKg: 80,
  visualCorrection: VisualCorrection.YES,
  visualCorrectionDioptre: 1,
  handedness: handednesses[3],
  email: "name.surname@email.com",
  phone: "123456789",
  projectInfo: {
    projectAcronym: "Proj1",
    projectId: "1",
    deviceName: "Device",
    deviceId: "1",
    isPhantom: true,
    measuredAt: new Date(),
    disapprovalReason: null,
  },
  answers: [
    {
      questionId: "1",
      partNumber: QuestionPartNumber.ONE,
      answer: AnswerOption.NO,
      comment: "",
    },
  ],
};

const visitNotCompleted: IVisit = {
  id: "1",
  createdAt: new Date(),
  visitId: "1",
  pdf: "pdf",
  state: VisitStateDEV.APPROVED,
  name: "Name",
  surname: "Surname",
  personalId: "000000",
  birthdate: new Date(),
  gender: genders[0],
  nativeLanguage: nativeLanguages[2],
  heightCm: 180,
  weightKg: 80,
  visualCorrection: VisualCorrection.NO,
  visualCorrectionDioptre: 0,
  handedness: handednesses[3],
  email: "",
  phone: "",
  projectInfo: {
    projectAcronym: "",
    projectId: "",
    deviceName: "",
    deviceId: "",
    isPhantom: true,
    measuredAt: null,
    disapprovalReason: null,
  },
  answers: [
    {
      questionId: "1",
      partNumber: QuestionPartNumber.ONE,
      answer: AnswerOption.NO,
      comment: "",
    },
  ],
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

  describe("default values loaded from a visit duplication", () => {
    test("all the visit attributes are defined", () => {
      const formDefaultValuesVisitDuplication = loadFormDefaultValuesVisitDuplication(visit);

      expect(formDefaultValuesVisitDuplication.project).toBeNull();
      expect(formDefaultValuesVisitDuplication.device).toBeNull();
      expect(formDefaultValuesVisitDuplication.measuredAt).toEqual(visit.projectInfo.measuredAt);
      expect(formDefaultValuesVisitDuplication.name).toEqual(visit.name);
      expect(formDefaultValuesVisitDuplication.surname).toEqual(visit.surname);
      expect(formDefaultValuesVisitDuplication.personalId).toEqual(visit.personalId);
      expect(formDefaultValuesVisitDuplication.birthdate).toEqual(visit.birthdate);
      expect(formDefaultValuesVisitDuplication.gender?.id).toEqual(visit.gender.id);
      expect(formDefaultValuesVisitDuplication.nativeLanguage).toEqual(visit.nativeLanguage);
      expect(formDefaultValuesVisitDuplication.heightCm).toEqual(visit.heightCm);
      expect(formDefaultValuesVisitDuplication.weightKg).toEqual(visit.weightKg);
      expect(formDefaultValuesVisitDuplication.handedness?.id).toEqual(visit.handedness.id);
      expect(formDefaultValuesVisitDuplication.visualCorrection?.value).toEqual(visit.visualCorrection);
      expect(formDefaultValuesVisitDuplication.visualCorrectionDioptre).toEqual(visit.visualCorrectionDioptre);
      expect(formDefaultValuesVisitDuplication.email).toEqual(visit.email);
      expect(formDefaultValuesVisitDuplication.phone).toEqual(visit.phone);
      expect(formDefaultValuesVisitDuplication.answers).toEqual(visit.answers);
    });

    test("all the visit nullable attributes are null", () => {
      const currentDate = new Date();
      vi.spyOn(global, "Date").mockImplementationOnce(() => currentDate as unknown as string);

      const formDefaultValuesVisitDuplication = loadFormDefaultValuesVisitDuplication(visitNotCompleted);

      expect(formDefaultValuesVisitDuplication.project).toBeNull();
      expect(formDefaultValuesVisitDuplication.device).toBeNull();
      expect(formDefaultValuesVisitDuplication.measuredAt).toEqual(currentDate);
      expect(formDefaultValuesVisitDuplication.name).toEqual(visitNotCompleted.name);
      expect(formDefaultValuesVisitDuplication.surname).toEqual(visitNotCompleted.surname);
      expect(formDefaultValuesVisitDuplication.personalId).toEqual(visitNotCompleted.personalId);
      expect(formDefaultValuesVisitDuplication.birthdate).toEqual(visitNotCompleted.birthdate);
      expect(formDefaultValuesVisitDuplication.gender?.id).toEqual(visitNotCompleted.gender.id);
      expect(formDefaultValuesVisitDuplication.nativeLanguage).toEqual(visitNotCompleted.nativeLanguage);
      expect(formDefaultValuesVisitDuplication.heightCm).toEqual(visitNotCompleted.heightCm);
      expect(formDefaultValuesVisitDuplication.weightKg).toEqual(visitNotCompleted.weightKg);
      expect(formDefaultValuesVisitDuplication.handedness?.id).toEqual(visitNotCompleted.handedness.id);
      expect(formDefaultValuesVisitDuplication.visualCorrection?.value).toEqual(visitNotCompleted.visualCorrection);
      expect(formDefaultValuesVisitDuplication.visualCorrectionDioptre).toEqual(
        visitNotCompleted.visualCorrectionDioptre
      );
      expect(formDefaultValuesVisitDuplication.email).toEqual(visitNotCompleted.email);
      expect(formDefaultValuesVisitDuplication.phone).toEqual(visitNotCompleted.phone);
      expect(formDefaultValuesVisitDuplication.answers).toEqual(visitNotCompleted.answers);
    });
  });
});
