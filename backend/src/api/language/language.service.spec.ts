import { Test } from "@nestjs/testing";
import { PrismaClient, type Language } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateLanguageInput } from "./dto/create-language.input";
import type { UpdateLanguageInput } from "./dto/update-language.input";
import { LanguageService } from "./language.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
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
describe("LanguageService", () => {
  let languageService: LanguageService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LanguageService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    languageService = module.get<LanguageService>(LanguageService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("create language", () => {
    // ARRANGE
    const languageInput: CreateLanguageInput = {
      ...languageEn,
    };
    prisma.language.create.mockResolvedValueOnce(languageEn);

    // ACT
    const createdLanguage = languageService.create(languageInput);

    // ASSERT
    expect(createdLanguage).resolves.toStrictEqual(languageEn);
  });

  it("find all languages", () => {
    // ARRANGE
    const languages: Language[] = [
      languageEn,
      {
        id: "2",
        code: "cs",
        name: "Czech",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    prisma.language.findMany.mockResolvedValueOnce(languages);

    // ACT
    const foundLanguages = languageService.findAll();

    // ASSERT
    expect(foundLanguages).resolves.toStrictEqual(languages);
  });

  it("find language", () => {
    // ARRANGE
    prisma.language.findUniqueOrThrow.mockResolvedValueOnce(languageEn);

    // ACT
    const foundLanguage = languageService.findOne(languageEn.id);

    // ASSERT
    expect(foundLanguage).resolves.toStrictEqual(languageEn);
  });

  it("update language", () => {
    // ARRANGE
    const updateLanguageInput: UpdateLanguageInput = {
      ...languageEn,
      code: "EN",
    };
    prisma.language.update.mockResolvedValueOnce({
      ...languageEn,
      ...updateLanguageInput,
    });

    // ACT
    const updatedLanguage = languageService.update(updateLanguageInput.id, updateLanguageInput);

    // ASSERT
    expect(updatedLanguage).resolves.toStrictEqual({
      ...languageEn,
      ...updateLanguageInput,
    });
  });

  it("remove language", () => {
    // ARRANGE
    const deletedNow = new Date();
    prisma.language.update.mockResolvedValueOnce({
      ...languageEn,
      deletedAt: deletedNow,
    });

    // ACT
    const removedLanguage = languageService.remove(languageEn.id);

    // ASSERT
    expect(removedLanguage).resolves.toStrictEqual({
      ...languageEn,
      deletedAt: deletedNow,
    });
  });
});
