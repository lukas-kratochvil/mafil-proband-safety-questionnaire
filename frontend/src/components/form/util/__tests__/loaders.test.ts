import { genders, handednesses, nativeLanguages } from "@app/data/translated_entities_data";
import { QuestionPartNumber } from "@app/interfaces/question";
import { AnswerOption, IVisit, VisitState, VisualCorrection } from "@app/interfaces/visit";
import {
  loadEmptyDefaultValues,
  loadFormDefaultValuesFromVisit,
  loadFormDefaultValuesVisitDuplication,
  loadPhantomFormDefaultValues,
} from "../loaders";

const visit: IVisit = {
  id: "1",
  createdAt: new Date(),
  visitId: "1",
  pdf: "pdf",
  state: VisitState.APPROVED,
  projectInfo: {
    project: "Project",
    projectId: "1",
    device: "Device",
    deviceId: "1",
    isPhantom: true,
    measurementDate: new Date(),
    disapprovalReason: null,
  },
  probandInfo: {
    name: "Name",
    surname: "Surname",
    personalId: "000000",
    birthdate: new Date(),
    gender: genders[0],
    nativeLanguage: nativeLanguages[2],
    height: 180,
    weight: 80,
    visualCorrection: VisualCorrection.YES,
    visualCorrectionValue: 1,
    handedness: handednesses[3],
    email: "name.surname@email.com",
    phone: "123456789",
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
  state: VisitState.APPROVED,
  projectInfo: {
    project: null,
    projectId: "",
    device: null,
    deviceId: "",
    isPhantom: true,
    measurementDate: null,
    disapprovalReason: null,
  },
  probandInfo: {
    name: "Name",
    surname: "Surname",
    personalId: "000000",
    birthdate: new Date(),
    gender: genders[0],
    nativeLanguage: nativeLanguages[2],
    height: 180,
    weight: 80,
    visualCorrection: VisualCorrection.NO,
    visualCorrectionValue: 0,
    handedness: handednesses[3],
    email: "",
    phone: "",
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
    expect(emptyFormDefaultValues.measurementDate).toBeNull();
    expect(emptyFormDefaultValues.name).toBe("");
    expect(emptyFormDefaultValues.surname).toBe("");
    expect(emptyFormDefaultValues.personalId).toBe("");
    expect(emptyFormDefaultValues.birthdate).toBeNull();
    expect(emptyFormDefaultValues.gender).toBeNull();
    expect(emptyFormDefaultValues.nativeLanguage).toBeNull();
    expect(emptyFormDefaultValues.height).toBe("");
    expect(emptyFormDefaultValues.weight).toBe("");
    expect(emptyFormDefaultValues.handedness).toBeNull();
    expect(emptyFormDefaultValues.visualCorrection).toBeNull();
    expect(emptyFormDefaultValues.visualCorrectionValue).toEqual(0);
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
    expect(phantomFormDefaultValues.measurementDate).toEqual(currentDate);
    expect(phantomFormDefaultValues.name).toEqual("");
    expect(phantomFormDefaultValues.surname).toBe("");
    expect(phantomFormDefaultValues.personalId).toBe("");
    expect(phantomFormDefaultValues.birthdate).toBeNull();
    expect(phantomFormDefaultValues.gender?.code).toEqual("O");
    expect(phantomFormDefaultValues.nativeLanguage).toBeNull();
    expect(phantomFormDefaultValues.height).toBe("");
    expect(phantomFormDefaultValues.weight).toBe("");
    expect(phantomFormDefaultValues.handedness).toBeNull();
    expect(phantomFormDefaultValues.visualCorrection).toBeNull();
    expect(phantomFormDefaultValues.visualCorrectionValue).toEqual(0);
    expect(phantomFormDefaultValues.email).toBe("");
    expect(phantomFormDefaultValues.phone).toBe("");
    expect(phantomFormDefaultValues.answers).toEqual([]);
  });

  describe("default values loaded from a visit", () => {
    test("all the visit attributes are defined", () => {
      const formDefaultValuesFromVisit = loadFormDefaultValuesFromVisit(visit);

      expect(formDefaultValuesFromVisit.project).toEqual(visit.projectInfo.project);
      expect(formDefaultValuesFromVisit.device).toEqual(visit.projectInfo.device);
      expect(formDefaultValuesFromVisit.measurementDate).toEqual(visit.projectInfo.measurementDate);
      expect(formDefaultValuesFromVisit.name).toEqual(visit.probandInfo.name);
      expect(formDefaultValuesFromVisit.surname).toEqual(visit.probandInfo.surname);
      expect(formDefaultValuesFromVisit.personalId).toEqual(visit.probandInfo.personalId);
      expect(formDefaultValuesFromVisit.birthdate).toEqual(visit.probandInfo.birthdate);
      expect(formDefaultValuesFromVisit.gender?.id).toEqual(visit.probandInfo.gender.id);
      expect(formDefaultValuesFromVisit.nativeLanguage).toEqual(visit.probandInfo.nativeLanguage);
      expect(formDefaultValuesFromVisit.height).toEqual(visit.probandInfo.height);
      expect(formDefaultValuesFromVisit.weight).toEqual(visit.probandInfo.weight);
      expect(formDefaultValuesFromVisit.handedness?.id).toEqual(visit.probandInfo.handedness.id);
      expect(formDefaultValuesFromVisit.visualCorrection?.value).toEqual(visit.probandInfo.visualCorrection);
      expect(formDefaultValuesFromVisit.visualCorrectionValue).toEqual(visit.probandInfo.visualCorrectionValue);
      expect(formDefaultValuesFromVisit.email).toEqual(visit.probandInfo.email);
      expect(formDefaultValuesFromVisit.phone).toEqual(visit.probandInfo.phone);
      expect(formDefaultValuesFromVisit.answers).toEqual(visit.answers);
    });

    test("all the visit nullable attributes are null", () => {
      const currentDate = new Date();
      vi.spyOn(global, "Date").mockImplementationOnce(() => currentDate as unknown as string);

      const formDefaultValuesFromVisit = loadFormDefaultValuesFromVisit(visitNotCompleted);

      expect(formDefaultValuesFromVisit.project).toBeNull();
      expect(formDefaultValuesFromVisit.device).toBeNull();
      expect(formDefaultValuesFromVisit.measurementDate).toEqual(currentDate);
      expect(formDefaultValuesFromVisit.name).toEqual(visitNotCompleted.probandInfo.name);
      expect(formDefaultValuesFromVisit.surname).toEqual(visitNotCompleted.probandInfo.surname);
      expect(formDefaultValuesFromVisit.personalId).toEqual(visitNotCompleted.probandInfo.personalId);
      expect(formDefaultValuesFromVisit.birthdate).toEqual(visitNotCompleted.probandInfo.birthdate);
      expect(formDefaultValuesFromVisit.gender?.id).toEqual(visitNotCompleted.probandInfo.gender.id);
      expect(formDefaultValuesFromVisit.nativeLanguage).toEqual(visitNotCompleted.probandInfo.nativeLanguage);
      expect(formDefaultValuesFromVisit.height).toEqual(visitNotCompleted.probandInfo.height);
      expect(formDefaultValuesFromVisit.weight).toEqual(visitNotCompleted.probandInfo.weight);
      expect(formDefaultValuesFromVisit.handedness?.id).toEqual(visitNotCompleted.probandInfo.handedness.id);
      expect(formDefaultValuesFromVisit.visualCorrection?.value).toEqual(
        visitNotCompleted.probandInfo.visualCorrection
      );
      expect(formDefaultValuesFromVisit.visualCorrectionValue).toEqual(
        visitNotCompleted.probandInfo.visualCorrectionValue
      );
      expect(formDefaultValuesFromVisit.email).toEqual(visitNotCompleted.probandInfo.email);
      expect(formDefaultValuesFromVisit.phone).toEqual(visitNotCompleted.probandInfo.phone);
      expect(formDefaultValuesFromVisit.answers).toEqual(visitNotCompleted.answers);
    });
  });

  describe("default values loaded from a visit duplication", () => {
    test("all the visit attributes are defined", () => {
      const formDefaultValuesVisitDuplication = loadFormDefaultValuesVisitDuplication(visit);

      expect(formDefaultValuesVisitDuplication.project).toBeNull();
      expect(formDefaultValuesVisitDuplication.device).toBeNull();
      expect(formDefaultValuesVisitDuplication.measurementDate).toEqual(visit.projectInfo.measurementDate);
      expect(formDefaultValuesVisitDuplication.name).toEqual(visit.probandInfo.name);
      expect(formDefaultValuesVisitDuplication.surname).toEqual(visit.probandInfo.surname);
      expect(formDefaultValuesVisitDuplication.personalId).toEqual(visit.probandInfo.personalId);
      expect(formDefaultValuesVisitDuplication.birthdate).toEqual(visit.probandInfo.birthdate);
      expect(formDefaultValuesVisitDuplication.gender?.id).toEqual(visit.probandInfo.gender.id);
      expect(formDefaultValuesVisitDuplication.nativeLanguage).toEqual(visit.probandInfo.nativeLanguage);
      expect(formDefaultValuesVisitDuplication.height).toEqual(visit.probandInfo.height);
      expect(formDefaultValuesVisitDuplication.weight).toEqual(visit.probandInfo.weight);
      expect(formDefaultValuesVisitDuplication.handedness?.id).toEqual(visit.probandInfo.handedness.id);
      expect(formDefaultValuesVisitDuplication.visualCorrection?.value).toEqual(visit.probandInfo.visualCorrection);
      expect(formDefaultValuesVisitDuplication.visualCorrectionValue).toEqual(visit.probandInfo.visualCorrectionValue);
      expect(formDefaultValuesVisitDuplication.email).toEqual(visit.probandInfo.email);
      expect(formDefaultValuesVisitDuplication.phone).toEqual(visit.probandInfo.phone);
      expect(formDefaultValuesVisitDuplication.answers).toEqual(visit.answers);
    });

    test("all the visit nullable attributes are null", () => {
      const currentDate = new Date();
      vi.spyOn(global, "Date").mockImplementationOnce(() => currentDate as unknown as string);

      const formDefaultValuesVisitDuplication = loadFormDefaultValuesVisitDuplication(visitNotCompleted);

      expect(formDefaultValuesVisitDuplication.project).toBeNull();
      expect(formDefaultValuesVisitDuplication.device).toBeNull();
      expect(formDefaultValuesVisitDuplication.measurementDate).toEqual(currentDate);
      expect(formDefaultValuesVisitDuplication.name).toEqual(visitNotCompleted.probandInfo.name);
      expect(formDefaultValuesVisitDuplication.surname).toEqual(visitNotCompleted.probandInfo.surname);
      expect(formDefaultValuesVisitDuplication.personalId).toEqual(visitNotCompleted.probandInfo.personalId);
      expect(formDefaultValuesVisitDuplication.birthdate).toEqual(visitNotCompleted.probandInfo.birthdate);
      expect(formDefaultValuesVisitDuplication.gender?.id).toEqual(visitNotCompleted.probandInfo.gender.id);
      expect(formDefaultValuesVisitDuplication.nativeLanguage).toEqual(visitNotCompleted.probandInfo.nativeLanguage);
      expect(formDefaultValuesVisitDuplication.height).toEqual(visitNotCompleted.probandInfo.height);
      expect(formDefaultValuesVisitDuplication.weight).toEqual(visitNotCompleted.probandInfo.weight);
      expect(formDefaultValuesVisitDuplication.handedness?.id).toEqual(visitNotCompleted.probandInfo.handedness.id);
      expect(formDefaultValuesVisitDuplication.visualCorrection?.value).toEqual(
        visitNotCompleted.probandInfo.visualCorrection
      );
      expect(formDefaultValuesVisitDuplication.visualCorrectionValue).toEqual(
        visitNotCompleted.probandInfo.visualCorrectionValue
      );
      expect(formDefaultValuesVisitDuplication.email).toEqual(visitNotCompleted.probandInfo.email);
      expect(formDefaultValuesVisitDuplication.phone).toEqual(visitNotCompleted.probandInfo.phone);
      expect(formDefaultValuesVisitDuplication.answers).toEqual(visitNotCompleted.answers);
    });
  });
});
