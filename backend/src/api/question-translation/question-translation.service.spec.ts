import { Test } from "@nestjs/testing";
import { PrismaClient, type QuestionTranslation } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateQuestionTranslationInput } from "./dto/create-question-translation.input";
import type { UpdateQuestionTranslationInput } from "./dto/update-question-translation.input";
import { QuestionTranslationService } from "./question-translation.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const questionTranslation: QuestionTranslation = {
  id: "1",
  languageId: "1",
  questionId: "1",
  text: "test",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("QuestionTranslationService", () => {
  let questionTranslationService: QuestionTranslationService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [QuestionTranslationService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    questionTranslationService = module.get<QuestionTranslationService>(QuestionTranslationService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("create question translation", () => {
    // ARRANGE
    const questionTranslationInput: CreateQuestionTranslationInput = { ...questionTranslation };
    prisma.questionTranslation.create.mockResolvedValueOnce(questionTranslation);

    // ACT
    const createdQuestionTranslation = questionTranslationService.create(questionTranslationInput);

    // ASSERT
    expect(createdQuestionTranslation).resolves.toStrictEqual(questionTranslation);
  });

  it("update question translation", () => {
    // ARRANGE
    const questionTranslationInput: UpdateQuestionTranslationInput = { ...questionTranslation, text: "test2" };
    prisma.questionTranslation.update.mockResolvedValueOnce({ ...questionTranslation, ...questionTranslationInput });

    // ACT
    const updatedQuestionTranslation = questionTranslationService.update(
      questionTranslationInput.id,
      questionTranslationInput
    );

    // ASSERT
    expect(updatedQuestionTranslation).resolves.toStrictEqual({ ...questionTranslation, ...questionTranslationInput });
  });
});
