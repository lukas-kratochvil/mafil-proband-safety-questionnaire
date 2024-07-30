import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaClient, VisitFormState, type VisitForm } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateVisitFormInput } from "./dto/create-visit-form.input";
import type { UpdateVisitFormInput } from "./dto/update-visit-form.input";
import { VisitFormService } from "./visit-form.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const visitForm: VisitForm = {
  id: "1",
  probandLanguageId: "1",
  genderId: "1",
  handednessId: "1",
  state: "NEW",
  sentToMafilDbAt: null,
  name: "John",
  surname: "Smith",
  personalId: "123456",
  birthdate: new Date(),
  nativeLanguageCode: "en",
  heightCm: 190,
  weightKg: 80,
  visualCorrectionDioptre: 0,
  email: "",
  phone: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("VisitFormService", () => {
  let visitFormService: VisitFormService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VisitFormService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    visitFormService = module.get<VisitFormService>(VisitFormService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("create visit form", () => {
    // ARRANGE
    const visitFormInput: CreateVisitFormInput = {
      ...visitForm,
      probandLanguageCode: "en",
      answers: [],
    };
    prisma.visitForm.create.mockResolvedValueOnce(visitForm);

    // ACT
    const createdVisitForm = visitFormService.create(visitFormInput);

    // ASSERT
    expect(createdVisitForm).resolves.toStrictEqual(visitForm);
  });

  it("find all visit forms", () => {
    // ARRANGE
    const visitForms: VisitForm[] = [
      visitForm,
      {
        ...visitForm,
        id: "2",
      },
    ];
    prisma.visitForm.findMany.mockResolvedValueOnce(visitForms);

    // ACT
    const foundVisitForms = visitFormService.findAll();

    // ASSERT
    expect(foundVisitForms).resolves.toStrictEqual(visitForms);
  });

  it("find visit form", () => {
    // ARRANGE
    prisma.visitForm.findUniqueOrThrow.mockResolvedValueOnce(visitForm);

    // ACT
    const foundVisitForm = visitFormService.findOne(visitForm.id);

    // ASSERT
    expect(foundVisitForm).resolves.toStrictEqual(visitForm);
  });

  it("update visit form", () => {
    // ARRANGE
    const updateVisitFormInput: UpdateVisitFormInput = {
      ...visitForm,
      state: VisitFormState.IN_APPROVAL,
      email: "john.smith@mail.com",
      phone: "123456789",
    };
    prisma.visitForm.findFirst.mockResolvedValueOnce(null);
    prisma.visitForm.update.mockResolvedValueOnce({
      ...visitForm,
      ...updateVisitFormInput,
    });
    prisma.$transaction.mockImplementation((callback) => callback(prisma));

    // ACT
    const updatedVisitForm = visitFormService.update(updateVisitFormInput.id, updateVisitFormInput);

    // ASSERT
    expect(updatedVisitForm).resolves.toStrictEqual({
      ...visitForm,
      ...updateVisitFormInput,
    });
  });

  it("update visit form - already in required state", () => {
    // ARRANGE
    const updateVisitFormInput: UpdateVisitFormInput = {
      ...visitForm,
      email: "john.smith@mail.com",
      phone: "123456789",
    };
    prisma.visitForm.findFirst.mockResolvedValueOnce(visitForm);
    prisma.visitForm.update.mockResolvedValueOnce({
      ...visitForm,
      ...updateVisitFormInput,
    });
    prisma.$transaction.mockImplementation((callback) => callback(prisma));

    // ACT
    const updatedVisitForm = visitFormService.update(updateVisitFormInput.id, updateVisitFormInput);

    // ASSERT
    expect(updatedVisitForm).rejects.toThrow(BadRequestException);
  });

  it("remove visit form", () => {
    // ARRANGE
    const deletedNow = new Date();
    prisma.visitForm.update.mockResolvedValueOnce({
      ...visitForm,
      state: VisitFormState.DELETED,
      deletedAt: deletedNow,
    });

    // ACT
    const removedVisitForm = visitFormService.remove(visitForm.id);

    // ASSERT
    expect(removedVisitForm).resolves.toStrictEqual({
      ...visitForm,
      state: VisitFormState.DELETED,
      deletedAt: deletedNow,
    });
  });
});
