import type { DuplicatedVisitIncludingQuestions } from "@app/model/visit";
import { gendersTest } from "@app/tests/data/genders";
import { handednessesTest } from "@app/tests/data/handednesses";
import { nativeLanguagesTest } from "@app/tests/data/languages";
import { operatorMRTest } from "@app/tests/data/operators";
import { projectsTest } from "@app/tests/data/projects";
import { subjectsTest } from "@app/tests/data/subjects";
import type {
  ApprovalRoomVisitFormIncludingQuestionsDTO,
  VisitFormAnswerIncludingQuestion,
  WaitingRoomVisitFormIncludingQuestions,
} from "@app/util/server_API/dto";
import {
  loadEmptyDefaultValues,
  loadFormDefaultValuesFromApprovalRoomVisitForm,
  loadFormDefaultValuesFromWaitingRoomVisitForm,
  loadFormDefaultValuesVisitDuplication,
  loadPhantomFormDefaultValues,
} from "../loaders";
import { getAutocompleteOption, visualCorrectionOptions } from "../options";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const answerIncludingQuestion: VisitFormAnswerIncludingQuestion = {
  questionId: "1",
  updatedAt: new Date(),
  answer: "NO",
  comment: "",
  partNumber: 1,
  mustBeApproved: false,
  order: 1,
  hiddenByGenders: [],
  translations: [],
};

const waitingRoomVisitForm: WaitingRoomVisitFormIncludingQuestions = {
  id: "123",
  createdAt: new Date(),
  state: "NEW",
  probandLanguageCode: "cs",
  name: "Name",
  surname: "Surname",
  personalId: "000000",
  birthdate: new Date(),
  gender: gendersTest[0]!,
  nativeLanguageCode: nativeLanguagesTest[2]!.code,
  heightCm: 180,
  weightKg: 80,
  visualCorrectionDioptre: 1,
  handedness: handednessesTest[3]!,
  email: "name.surname@email.com",
  phone: "123456789",
  answersIncludingQuestions: [answerIncludingQuestion],
};

const approvalRoomVisitForm: ApprovalRoomVisitFormIncludingQuestionsDTO = {
  ...waitingRoomVisitForm,
  answersIncludingQuestions: [{ ...answerIncludingQuestion, comment: "comment" }],
  additionalInfo: {
    projectUuid: "1552314",
    deviceId: 6552515,
    measuredAt: new Date(),
    finalizer: operatorMRTest,
    finalizedAt: new Date(),
  },
};

const duplicatedVisit: DuplicatedVisitIncludingQuestions = {
  uuid: "1",
  visitId: "1",
  isPhantom: false,
  measurementDate: new Date(),
  subject: subjectsTest[0]!,
  project: projectsTest[0]!,
  deviceId: 1,
  gender: gendersTest[0]!,
  heightCm: 180,
  weightKg: 80,
  visualCorrectionDioptre: 1,
  handedness: handednessesTest[3]!,
  answersIncludingQuestions: [answerIncludingQuestion],
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("form loaders", () => {
  test("empty form default values", () => {
    // ACT
    const emptyFormDefaultValues = loadEmptyDefaultValues();

    // ASSERT
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
    // ARRANGE
    const currentDate = new Date();
    const mockedDate = vi.spyOn(global, "Date").mockImplementation(() => currentDate as unknown as string);

    // ACT
    const phantomFormDefaultValues = loadPhantomFormDefaultValues();

    // ASSERT
    expect(phantomFormDefaultValues.project).toBeNull();
    expect(phantomFormDefaultValues.device).toBeNull();
    expect(phantomFormDefaultValues.measuredAt).toEqual(currentDate);
    expect(phantomFormDefaultValues.name).toEqual("");
    expect(phantomFormDefaultValues.surname).toBe("");
    expect(phantomFormDefaultValues.personalId).toBe("");
    expect(phantomFormDefaultValues.birthdate).toEqual(currentDate);
    expect(phantomFormDefaultValues.gender).toBeNull(); // is set to 'Other' in the FormProbandInfo component
    expect(phantomFormDefaultValues.nativeLanguage).toBeNull(); // is set to 'Other' in the FormProbandInfo component
    expect(phantomFormDefaultValues.heightCm).toBe("");
    expect(phantomFormDefaultValues.weightKg).toBe("");
    expect(phantomFormDefaultValues.handedness).toBeNull(); // is set to 'Undetermined' in the FormProbandInfo component
    expect(phantomFormDefaultValues.visualCorrection).toEqual(getAutocompleteOption(visualCorrectionOptions, "no"));
    expect(phantomFormDefaultValues.visualCorrectionDioptre).toEqual(0);
    expect(phantomFormDefaultValues.email).toBe("");
    expect(phantomFormDefaultValues.phone).toBe("");
    expect(phantomFormDefaultValues.answers).toEqual([]);

    mockedDate.mockRestore();
  });

  test("waiting room visit form default values", () => {
    // ARRANGE
    const fetchedVisit = waitingRoomVisitForm;

    // ACT
    const loadedFormValues = loadFormDefaultValuesFromWaitingRoomVisitForm(fetchedVisit);

    // ASSERT
    expect(loadedFormValues.name).toEqual(fetchedVisit.name);
    expect(loadedFormValues.surname).toEqual(fetchedVisit.surname);
    expect(loadedFormValues.personalId).toEqual(fetchedVisit.personalId);
    expect(loadedFormValues.birthdate).toEqual(fetchedVisit.birthdate);
    expect(loadedFormValues.gender?.id).toEqual(fetchedVisit.gender.id);
    expect(loadedFormValues.nativeLanguage?.code).toEqual(fetchedVisit.nativeLanguageCode);
    expect(loadedFormValues.heightCm).toEqual(fetchedVisit.heightCm);
    expect(loadedFormValues.weightKg).toEqual(fetchedVisit.weightKg);
    expect(loadedFormValues.handedness?.id).toEqual(fetchedVisit.handedness.id);
    expect(loadedFormValues.visualCorrection?.value).toEqual(fetchedVisit.visualCorrectionDioptre === 0 ? "no" : "yes");
    expect(loadedFormValues.visualCorrectionDioptre).toEqual(fetchedVisit.visualCorrectionDioptre);
    expect(loadedFormValues.email).toEqual(fetchedVisit.email);
    expect(loadedFormValues.phone).toEqual(fetchedVisit.phone);
    loadedFormValues.answers.forEach((loadedAnswer, i) => {
      expect(loadedAnswer.answer).toEqual(fetchedVisit.answersIncludingQuestions[i]?.answer);
      expect(loadedAnswer.questionId).toEqual(fetchedVisit.answersIncludingQuestions[i]?.questionId);
      expect(loadedAnswer.comment).toEqual("");
    });
  });

  test("approval room visit form default values", () => {
    // ARRANGE
    const fetchedVisit = approvalRoomVisitForm;

    // ACT
    const loadedFormValues = loadFormDefaultValuesFromApprovalRoomVisitForm(fetchedVisit);

    // ASSERT
    expect(loadedFormValues.project?.uuid).toEqual(fetchedVisit.additionalInfo.projectUuid); // project is loaded in the FormProjectInfo component using the projectUuid
    expect(loadedFormValues.device?.id).toEqual(fetchedVisit.additionalInfo.deviceId); // device is loaded in the FormProjectInfo component using the deviceId
    expect(loadedFormValues.measuredAt).toEqual(fetchedVisit.additionalInfo.measuredAt);
    expect(loadedFormValues.name).toEqual(fetchedVisit.name);
    expect(loadedFormValues.surname).toEqual(fetchedVisit.surname);
    expect(loadedFormValues.personalId).toEqual(fetchedVisit.personalId);
    expect(loadedFormValues.birthdate).toEqual(fetchedVisit.birthdate);
    expect(loadedFormValues.gender?.id).toEqual(fetchedVisit.gender.id);
    expect(loadedFormValues.nativeLanguage?.code).toEqual(fetchedVisit.nativeLanguageCode);
    expect(loadedFormValues.heightCm).toEqual(fetchedVisit.heightCm);
    expect(loadedFormValues.weightKg).toEqual(fetchedVisit.weightKg);
    expect(loadedFormValues.handedness?.id).toEqual(fetchedVisit.handedness.id);
    expect(loadedFormValues.visualCorrection?.value).toEqual(fetchedVisit.visualCorrectionDioptre === 0 ? "no" : "yes");
    expect(loadedFormValues.visualCorrectionDioptre).toEqual(fetchedVisit.visualCorrectionDioptre);
    expect(loadedFormValues.email).toEqual(fetchedVisit.email);
    expect(loadedFormValues.phone).toEqual(fetchedVisit.phone);
    loadedFormValues.answers.forEach((loadedAnswer, i) => {
      expect(loadedAnswer.answer).toEqual(fetchedVisit.answersIncludingQuestions[i]?.answer);
      expect(loadedAnswer.questionId).toEqual(fetchedVisit.answersIncludingQuestions[i]?.questionId);
      expect(loadedAnswer.comment).toEqual(fetchedVisit.answersIncludingQuestions[i]?.comment);
    });
  });

  test("duplicated visit form default values", () => {
    // ARRANGE
    const currentDate = new Date();
    vi.spyOn(global, "Date").mockImplementationOnce(() => currentDate as unknown as string);

    // ACT
    const formDefaultValuesVisitDuplication = loadFormDefaultValuesVisitDuplication(duplicatedVisit);

    // ASSERT
    expect(formDefaultValuesVisitDuplication.project).toBeNull();
    expect(formDefaultValuesVisitDuplication.device).toBeNull();
    expect(formDefaultValuesVisitDuplication.measuredAt).toEqual(currentDate);
    expect(formDefaultValuesVisitDuplication.name).toEqual(duplicatedVisit.subject.name);
    expect(formDefaultValuesVisitDuplication.surname).toEqual(duplicatedVisit.subject.surname);
    expect(formDefaultValuesVisitDuplication.personalId).toEqual(duplicatedVisit.subject.personalId);
    expect(formDefaultValuesVisitDuplication.birthdate).toEqual(duplicatedVisit.subject.birthdate);
    expect(formDefaultValuesVisitDuplication.gender?.id).toEqual(duplicatedVisit.gender.id);
    expect(formDefaultValuesVisitDuplication.nativeLanguage).toEqual(duplicatedVisit.subject.nativeLanguage);
    expect(formDefaultValuesVisitDuplication.heightCm).toEqual(duplicatedVisit.heightCm);
    expect(formDefaultValuesVisitDuplication.weightKg).toEqual(duplicatedVisit.weightKg);
    expect(formDefaultValuesVisitDuplication.handedness?.id).toEqual(duplicatedVisit.handedness.id);
    expect(formDefaultValuesVisitDuplication.visualCorrection?.value).toEqual(
      duplicatedVisit.visualCorrectionDioptre === 0 ? "no" : "yes"
    );
    expect(formDefaultValuesVisitDuplication.visualCorrectionDioptre).toEqual(duplicatedVisit.visualCorrectionDioptre);
    expect(formDefaultValuesVisitDuplication.email).toEqual(duplicatedVisit.subject.email);
    expect(formDefaultValuesVisitDuplication.phone).toEqual(duplicatedVisit.subject.phone);

    formDefaultValuesVisitDuplication.answers.forEach((answer, i) => {
      expect(answer.questionId).toEqual(duplicatedVisit.answersIncludingQuestions[i]?.questionId);
      expect(answer.mustBeApproved).toEqual(duplicatedVisit.answersIncludingQuestions[i]?.mustBeApproved);
      expect(answer.answer).toEqual(duplicatedVisit.answersIncludingQuestions[i]?.answer);
      expect(answer.comment).toEqual(duplicatedVisit.answersIncludingQuestions[i]?.comment);
    });
  });
});
