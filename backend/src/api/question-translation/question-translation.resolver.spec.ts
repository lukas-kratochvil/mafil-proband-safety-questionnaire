import { Test } from "@nestjs/testing";
import type { QuestionTranslation } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateQuestionTranslationInput } from "./dto/create-question-translation.input";
import type { UpdateQuestionTranslationInput } from "./dto/update-question-translation.input";
import { QuestionTranslationResolver } from "./question-translation.resolver";
import { QuestionTranslationService } from "./question-translation.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const questionTranslation: QuestionTranslation = {
  id: "1",
  questionId: "1",
  languageId: "1",
  text: "Are you okay?",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("QuestionTranslationResolver", () => {
  let questionTranslationResolver: QuestionTranslationResolver;
  let questionTranslationService: DeepMockProxy<QuestionTranslationService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [QuestionTranslationResolver, QuestionTranslationService, PrismaService],
    })
      .overrideProvider(QuestionTranslationService)
      .useValue(mockDeep<QuestionTranslationService>())
      .compile();

    questionTranslationResolver = module.get<QuestionTranslationResolver>(QuestionTranslationResolver);
    questionTranslationService = module.get<QuestionTranslationService, DeepMockProxy<QuestionTranslationService>>(
      QuestionTranslationService
    );
  });

  it("create question translation", () => {
    // ARRANGE
    const createQuestionInput: CreateQuestionTranslationInput = { ...questionTranslation };
    questionTranslationService.create.mockResolvedValueOnce(questionTranslation);

    // ACT
    const createdQuestionTranslation = questionTranslationResolver.createQuestionTranslation(createQuestionInput);

    // ASSERT
    expect(createdQuestionTranslation).resolves.toEqual(questionTranslation);
  });

  it("update question translation", () => {
    // ARRANGE
    const updateQuestionTranslationInput: UpdateQuestionTranslationInput = {
      ...questionTranslation,
      text: "Female",
    };
    questionTranslationService.update.mockResolvedValueOnce({
      ...questionTranslation,
      text: updateQuestionTranslationInput.text,
    });

    // ACT
    const updatedQuestionTranslation
      = questionTranslationResolver.updateQuestionTranslation(updateQuestionTranslationInput);

    // ASSERT
    expect(updatedQuestionTranslation).resolves.toEqual({
      ...questionTranslation,
      text: updateQuestionTranslationInput.text,
    });
  });
});
