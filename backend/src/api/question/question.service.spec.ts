import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaClient, type Language, type Question } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateQuestionInput } from "./dto/create-question.input";
import type { UpdateQuestionTextsInput } from "./dto/update-question-texts.input";
import type { UpdateQuestionInput } from "./dto/update-question.input";
import { QuestionService } from "./question.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const question: Question = {
  id: "1",
  order: 1,
  partNumber: 1,
  mustBeApproved: false,
  isValid: false,
  previousQuestionId: null,
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
describe("QuestionService", () => {
  let questionService: QuestionService;
  let languageService: DeepMockProxy<LanguageService>;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [QuestionService, PrismaService, LanguageService],
    })
      .overrideProvider(LanguageService)
      .useValue(mockDeep<LanguageService>())
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    questionService = module.get<QuestionService>(QuestionService);
    languageService = module.get<LanguageService, DeepMockProxy<LanguageService>>(LanguageService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("create question", () => {
    // ARRANGE
    const languages: Language[] = [languageEn];
    languageService.findAll.mockResolvedValueOnce(languages);

    const questionInput: CreateQuestionInput = {
      ...question,
      translations: [{ code: languageEn.code, text: "Question?" }],
    };
    prisma.question.create.mockResolvedValueOnce(question);

    // ACT
    const createdQuestion = questionService.create(questionInput);

    // ASSERT
    expect(createdQuestion).resolves.toStrictEqual(question);
  });

  it("create question - incomplete translations", () => {
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

    const questionInput: CreateQuestionInput = {
      ...question,
      translations: [{ code: languageEn.code, text: "Question?" }],
    };

    // ACT
    const createdQuestion = questionService.create(questionInput);

    // ASSERT
    expect(createdQuestion).rejects.toThrow(BadRequestException);
  });

  it("find all questions", () => {
    // ARRANGE
    const questions: Question[] = [
      question,
      {
        id: "2",
        order: 2,
        partNumber: 2,
        mustBeApproved: false,
        isValid: false,
        previousQuestionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    prisma.question.findMany.mockResolvedValueOnce(questions);

    // ACT
    const foundQuestions = questionService.findAll();

    // ASSERT
    expect(foundQuestions).resolves.toStrictEqual(questions);
  });

  it("find question", () => {
    // ARRANGE
    prisma.question.findUniqueOrThrow.mockResolvedValueOnce(question);

    // ACT
    const foundQuestion = questionService.findOne(question.id);

    // ASSERT
    expect(foundQuestion).resolves.toStrictEqual(question);
  });

  it("update question", () => {
    // ARRANGE
    const languages: Language[] = [];
    languageService.findAll.mockResolvedValueOnce(languages);

    const updateQuestionInput: UpdateQuestionInput = {
      id: question.id,
      partNumber: 2,
    };
    prisma.question.update.mockResolvedValueOnce({
      ...question,
      ...updateQuestionInput,
    });

    // ACT
    const updatedQuestion = questionService.update(updateQuestionInput.id, updateQuestionInput);

    // ASSERT
    expect(updatedQuestion).resolves.toStrictEqual({
      ...question,
      ...updateQuestionInput,
    });
  });

  it("update question texts", () => {
    // ARRANGE
    const languages: Language[] = [languageEn];
    languageService.findAll.mockResolvedValueOnce(languages);

    const updateQuestionTexts: UpdateQuestionTextsInput = {
      id: question.id,
      translations: [{ code: languageEn.code, text: "Updated question text" }],
    };
    prisma.question.update.mockResolvedValueOnce({
      ...question,
      isValid: false,
      hiddenByGenders: jest.fn().mockResolvedValueOnce([]),
    });
    prisma.question.create.mockResolvedValueOnce(question);

    // ACT
    const updatedQuestionTexts = questionService.updateTexts(updateQuestionTexts.id, updateQuestionTexts);

    // ASSERT
    expect(updatedQuestionTexts).resolves.toStrictEqual(question);
  });

  it("update question texts - invalid language", () => {
    // ARRANGE
    const languages: Language[] = [languageEn];
    languageService.findAll.mockResolvedValueOnce(languages);

    const updateQuestionTexts: UpdateQuestionTextsInput = {
      id: question.id,
      translations: [],
    };

    // ACT
    const updatedQuestionTexts = questionService.updateTexts(updateQuestionTexts.id, updateQuestionTexts);

    // ASSERT
    expect(updatedQuestionTexts).rejects.toThrow(BadRequestException);
  });

  it("remove question", () => {
    // ARRANGE
    const deletedNow = new Date();
    prisma.question.update.mockResolvedValueOnce({
      ...question,
      deletedAt: deletedNow,
    });

    // ACT
    const removedQuestion = questionService.remove(question.id);

    // ASSERT
    expect(removedQuestion).resolves.toStrictEqual({
      ...question,
      deletedAt: deletedNow,
    });
  });
});
