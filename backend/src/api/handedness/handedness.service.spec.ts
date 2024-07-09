import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaClient, type Handedness, type Language } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateHandednessInput } from "./dto/create-handedness.input";
import type { UpdateHandednessInput } from "./dto/update-handedness.input";
import { HandednessService } from "./handedness.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const handednessR: Handedness = {
  id: "1",
  code: "RH",
  order: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
const languageEn: Language = {
  id: "1",
  code: "en",
  name: "English",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("HandednessService", () => {
  let handednessService: HandednessService;
  let languageService: DeepMockProxy<LanguageService>;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HandednessService, PrismaService, LanguageService],
    })
      .overrideProvider(LanguageService)
      .useValue(mockDeep<LanguageService>())
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    handednessService = module.get<HandednessService>(HandednessService);
    languageService = module.get<LanguageService, DeepMockProxy<LanguageService>>(LanguageService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("create handedness", () => {
    // ARRANGE
    const languages: Language[] = [languageEn];
    languageService.findAll.mockResolvedValueOnce(languages);

    const handednessInput: CreateHandednessInput = {
      ...handednessR,
      translations: [{ code: languageEn.code, text: "Right-handed" }],
    };
    prisma.handedness.create.mockResolvedValueOnce(handednessR);

    // ACT
    const createdHandedness = handednessService.create(handednessInput);

    // ASSERT
    expect(createdHandedness).resolves.toStrictEqual(handednessR);
  });

  it("create handedness incomplete translations", () => {
    // ARRANGE
    const languages: Language[] = [
      languageEn,
      {
        id: "2",
        name: "Czech",
        code: "cs",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    languageService.findAll.mockResolvedValueOnce(languages);

    const handednessInput: CreateHandednessInput = {
      ...handednessR,
      translations: [{ code: languageEn.code, text: "Right-handed" }],
    };

    // ACT
    const createdHandedness = handednessService.create(handednessInput);

    // ASSERT
    expect(createdHandedness).rejects.toThrow(BadRequestException);
  });

  it("return handedness", () => {
    // ARRANGE
    prisma.handedness.findUniqueOrThrow.mockResolvedValueOnce(handednessR);

    // ACT
    const foundHandedness = handednessService.findOne(handednessR.code);

    // ASSERT
    expect(foundHandedness).resolves.toStrictEqual(handednessR);
  });

  it("return all handednesses", () => {
    // ARRANGE
    const handednesses: Handedness[] = [
      handednessR,
      {
        id: "2",
        code: "LH",
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    prisma.handedness.findMany.mockResolvedValueOnce(handednesses);

    // ACT
    const foundHandednesses = handednessService.findAll();

    // ASSERT
    expect(foundHandednesses).resolves.toStrictEqual(handednesses);
  });

  it("update handedness", async () => {
    // ARRANGE
    const languages: Language[] = [];
    languageService.findAll.mockResolvedValueOnce(languages);

    const updateHandednessInput: UpdateHandednessInput = {
      id: handednessR.id,
      code: "LH",
    };
    prisma.handedness.update.mockResolvedValueOnce({
      ...handednessR,
      ...updateHandednessInput,
    });

    // ACT
    const updatedHandedness = handednessService.update(updateHandednessInput.id, updateHandednessInput);

    // ASSERT
    expect(updatedHandedness).resolves.toStrictEqual({
      ...handednessR,
      ...updateHandednessInput,
    });
  });

  it("update handedness invalid language", () => {
    // ARRANGE
    const languages: Language[] = [];
    languageService.findAll.mockResolvedValueOnce(languages);

    const updateHandednessInput: UpdateHandednessInput = {
      ...handednessR,
      code: "LH",
      translations: [{ code: languageEn.code, text: "Left-handed" }],
    };

    // ACT
    const updatedHandedness = handednessService.update(updateHandednessInput.id, updateHandednessInput);

    // ASSERT
    expect(updatedHandedness).rejects.toBeInstanceOf(BadRequestException);
  });

  it("remove handedness", () => {
    // ARRANGE
    const deletedNow = new Date();
    prisma.handedness.update.mockResolvedValueOnce({
      ...handednessR,
      deletedAt: deletedNow,
    });

    // ACT
    const removedHandedness = handednessService.remove(handednessR.id);

    // ASSERT
    expect(removedHandedness).resolves.toStrictEqual({
      ...handednessR,
      deletedAt: deletedNow,
    });
  });
});
