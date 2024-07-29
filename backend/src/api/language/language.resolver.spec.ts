import { Test } from "@nestjs/testing";
import type { Language } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import type { CreateLanguageInput } from "./dto/create-language.input";
import type { UpdateLanguageInput } from "./dto/update-language.input";
import { LanguageResolver } from "./language.resolver";
import { LanguageService } from "./language.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const language: Language = {
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
describe("LanguageResolver", () => {
  let languageResolver: LanguageResolver;
  let languageService: DeepMockProxy<LanguageService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LanguageResolver, LanguageService],
    })
      .overrideProvider(LanguageService)
      .useValue(mockDeep<LanguageService>())
      .compile();

    languageResolver = module.get<LanguageResolver>(LanguageResolver);
    languageService = module.get<LanguageService, DeepMockProxy<LanguageService>>(LanguageService);
  });

  it("create language", () => {
    // ARRANGE
    const createLanguageInput: CreateLanguageInput = { ...language };
    languageService.create.mockResolvedValueOnce(language);

    // ACT
    const createdLanguage = languageResolver.createLanguage(createLanguageInput);

    // ASSERT
    expect(createdLanguage).resolves.toEqual(language);
  });

  it("get language", () => {
    // ARRANGE
    languageService.findOne.mockResolvedValueOnce(language);

    // ACT
    const foundLanguage = languageResolver.getLanguage(language.code);

    // ASSERT
    expect(foundLanguage).resolves.toEqual(language);
  });

  it("get languages", () => {
    // ARRANGE
    const languages = [language];
    languageService.findAll.mockResolvedValueOnce(languages);

    // ACT
    const foundLanguages = languageResolver.getLanguages();

    // ASSERT
    expect(foundLanguages).resolves.toEqual(languages);
  });

  it("update language", () => {
    // ARRANGE
    const updateLanguageInput: UpdateLanguageInput = {
      id: language.id,
      code: "x",
    };
    languageService.update.mockResolvedValueOnce({ ...language, code: updateLanguageInput.code as string });

    // ACT
    const updatedLanguage = languageResolver.updateLanguage(updateLanguageInput);

    // ASSERT
    expect(updatedLanguage).resolves.toEqual({ ...language, code: updateLanguageInput.code });
  });

  it("remove language", () => {
    // ARRANGE
    const deletedAt = new Date();
    languageService.remove.mockResolvedValueOnce({ ...language, deletedAt: deletedAt });

    // ACT
    const removedLanguage = languageResolver.removeLanguage(language.id);

    // ASSERT
    expect(removedLanguage).resolves.toEqual({ ...language, deletedAt: deletedAt });
  });
});
