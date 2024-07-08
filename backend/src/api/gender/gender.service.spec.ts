import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaClient, type Gender, type Language } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateGenderInput } from "./dto/create-gender.input";
import type { UpdateGenderInput } from "./dto/update-gender.input";
import { GenderService } from "./gender.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const genderM: Gender = {
  id: "1",
  code: "M",
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
describe("GenderService", () => {
  let genderService: GenderService;
  let languageService: DeepMockProxy<LanguageService>;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GenderService, PrismaService, LanguageService],
    })
      .overrideProvider(LanguageService)
      .useValue(mockDeep<LanguageService>())
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    genderService = module.get<GenderService>(GenderService);
    languageService = module.get<LanguageService, DeepMockProxy<LanguageService>>(LanguageService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("create gender", () => {
    // ARRANGE
    const languages: Language[] = [languageEn];
    languageService.findAll.mockResolvedValueOnce(languages);

    const genderInput: CreateGenderInput = {
      ...genderM,
      translations: [{ code: languageEn.code, text: "Male" }],
    };
    prisma.gender.create.mockResolvedValueOnce(genderM);

    // ACT
    const createdGender = genderService.create(genderInput);

    // ASSERT
    expect(createdGender).resolves.toStrictEqual(genderM);
  });

  it("create gender incomplete translations", () => {
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

    const genderInput: CreateGenderInput = {
      ...genderM,
      translations: [{ code: languageEn.code, text: "Male" }],
    };

    // ACT
    const createdGender = genderService.create(genderInput);

    // ASSERT
    expect(createdGender).rejects.toThrow(BadRequestException);
  });

  it("return gender", () => {
    // ARRANGE
    prisma.gender.findUniqueOrThrow.mockResolvedValueOnce(genderM);

    // ACT
    const foundGender = genderService.findOne(genderM.code);

    // ASSERT
    expect(foundGender).resolves.toStrictEqual(genderM);
  });

  it("return all genders", () => {
    // ARRANGE
    const genders: Gender[] = [
      genderM,
      {
        id: "2",
        code: "F",
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    prisma.gender.findMany.mockResolvedValueOnce(genders);

    // ACT
    const foundGenders = genderService.findAll();

    // ASSERT
    expect(foundGenders).resolves.toStrictEqual(genders);
  });

  it("update gender", () => {
    // ARRANGE
    const languages: Language[] = [];
    languageService.findAll.mockResolvedValueOnce(languages);

    const updateGenderInput: UpdateGenderInput = {
      id: genderM.id,
      code: "F",
    };
    prisma.gender.update.mockResolvedValueOnce({
      ...genderM,
      ...updateGenderInput,
    });

    // ACT
    const updatedGender = genderService.update(updateGenderInput.id, updateGenderInput);

    // ASSERT
    expect(updatedGender).resolves.toStrictEqual({
      ...genderM,
      ...updateGenderInput,
    });
  });

  it("update gender invalid language", () => {
    // ARRANGE
    const languages: Language[] = [];
    languageService.findAll.mockResolvedValueOnce(languages);

    const updateGenderInput: UpdateGenderInput = {
      ...genderM,
      code: "F",
      translations: [{ code: languageEn.code, text: "Female" }],
    };

    // ACT
    const updatedGender = genderService.update(updateGenderInput.id, updateGenderInput);

    // ASSERT
    expect(updatedGender).rejects.toBeInstanceOf(BadRequestException);
  });

  it("remove gender", () => {
    // ARRANGE
    const deletedNow = new Date();
    prisma.gender.update.mockResolvedValueOnce({
      ...genderM,
      deletedAt: deletedNow,
    });

    // ACT
    const removedGender = genderService.remove(genderM.id);

    // ASSERT
    expect(removedGender).resolves.toStrictEqual({
      ...genderM,
      deletedAt: deletedNow,
    });
  });
});
