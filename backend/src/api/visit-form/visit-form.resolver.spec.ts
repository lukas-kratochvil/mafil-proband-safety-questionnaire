import { Test } from "@nestjs/testing";
import { Language, Operator, VisitFormState } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import type { CreateVisitFormInput } from "./dto/create-visit-form.input";
import type { UpdateVisitFormInput } from "./dto/update-visit-form.input";
import { VisitFormResolver } from "./visit-form.resolver";
import { VisitFormService } from "./visit-form.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const baseEntity = {
  id: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
const language: Language = {
  ...baseEntity,
  code: "en",
  name: "English",
};
const operator: Operator = {
  ...baseEntity,
  name: "Adam",
  surname: "Song",
  username: "adam.song",
  email: "adam.song@mail.com",
  role: "MR",
  isValid: true,
  lastLoggedAt: new Date(),
};
const visitForm = {
  ...baseEntity,
  state: VisitFormState.NEW,
  sentToMafilDbAt: null,
  additionalInfo: {
    ...baseEntity,
    visitFormId: "1",
    finalizer: operator,
    finalizerId: operator.id,
    projectUuid: "1",
    deviceId: 1,
    measuredAt: new Date(),
    finalizedAt: new Date(),
  },
  probandLanguage: language,
  probandLanguageId: language.id,
  gender: {
    ...baseEntity,
    code: "en",
    order: 1,
    translations: [{ text: "Male", language }],
  },
  genderId: "1",
  handedness: {
    ...baseEntity,
    code: "en",
    order: 1,
    translations: [{ text: "Right-handed", language }],
  },
  handednessId: "1",
  name: "John",
  surname: "Smith",
  personalId: "123456",
  birthdate: new Date(),
  nativeLanguageCode: "en",
  heightCm: 80,
  weightKg: 190,
  answers: [],
  email: "",
  phone: "",
  visualCorrectionDioptre: 0,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("VisitFormResolver", () => {
  let visitFormResolver: VisitFormResolver;
  let visitFormService: DeepMockProxy<VisitFormService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VisitFormResolver, VisitFormService],
    })
      .overrideProvider(VisitFormService)
      .useValue(mockDeep<VisitFormService>())
      .compile();

    visitFormResolver = module.get<VisitFormResolver>(VisitFormResolver);
    visitFormService = module.get<VisitFormService, DeepMockProxy<VisitFormService>>(VisitFormService);
  });

  it("create visit form", () => {
    // ARRANGE
    const createVisitFormInput: CreateVisitFormInput = {
      ...visitForm,
      probandLanguageCode: visitForm.probandLanguage.code,
    };
    visitFormService.create.mockResolvedValueOnce(visitForm);

    // ACT
    const createdVisitForm = visitFormResolver.createVisitForm(createVisitFormInput);

    // ASSERT
    expect(createdVisitForm).resolves.toEqual(visitForm);
  });

  it("get visit form", () => {
    // ARRANGE
    visitFormService.findOne.mockResolvedValueOnce(visitForm);

    // ACT
    const foundVisitForm = visitFormResolver.getVisitForm(visitForm.id);

    // ASSERT
    expect(foundVisitForm).resolves.toEqual(visitForm);
  });

  it("get visit forms", () => {
    // ARRANGE
    const visitForms = [visitForm];
    visitFormService.findAll.mockResolvedValueOnce(visitForms);

    // ACT
    const foundVisitForms = visitFormResolver.getVisitForms();

    // ASSERT
    expect(foundVisitForms).resolves.toEqual(visitForms);
  });

  it("update visit form", () => {
    // ARRANGE
    const updateVisitFormInput: UpdateVisitFormInput = {
      id: visitForm.id,
      state: VisitFormState.IN_APPROVAL,
    };
    visitFormService.update.mockResolvedValueOnce({
      ...visitForm,
      state: updateVisitFormInput.state as VisitFormState,
    });

    // ACT
    const updatedVisitForm = visitFormResolver.updateVisitForm(updateVisitFormInput);

    // ASSERT
    expect(updatedVisitForm).resolves.toEqual({ ...visitForm, state: updateVisitFormInput.state });
  });

  it("remove visit form", () => {
    // ARRANGE
    const deletedAt = new Date();
    visitFormService.remove.mockResolvedValueOnce({ ...visitForm, deletedAt: deletedAt });

    // ACT
    const removedVisitForm = visitFormResolver.removeVisitForm(visitForm.id);

    // ASSERT
    expect(removedVisitForm).resolves.toBeUndefined();
  });
});
