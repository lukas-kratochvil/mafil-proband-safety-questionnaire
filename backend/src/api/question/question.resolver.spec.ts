import { Test } from "@nestjs/testing";
import type { Language } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import type { CreateQuestionInput } from "./dto/create-question.input";
import type { UpdateQuestionTextsInput } from "./dto/update-question-texts.input";
import type { UpdateQuestionInput } from "./dto/update-question.input";
import { QuestionResolver } from "./question.resolver";
import { QuestionService } from "./question.service";

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
const question = {
  id: "1",
  order: 1,
  partNumber: 1,
  mustBeApproved: false,
  previousQuestionId: null,
  isValid: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  hiddenByGenders: [],
  translations: [
    {
      text: "Are you okay?",
      language,
    },
  ],
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("QuestionResolver", () => {
  let questionResolver: QuestionResolver;
  let questionService: DeepMockProxy<QuestionService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [QuestionResolver, QuestionService],
    })
      .overrideProvider(QuestionService)
      .useValue(mockDeep<QuestionService>())
      .compile();

    questionResolver = module.get<QuestionResolver>(QuestionResolver);
    questionService = module.get<QuestionService, DeepMockProxy<QuestionService>>(QuestionService);
  });

  it("create question", () => {
    // ARRANGE
    const createQuestionInput: CreateQuestionInput = {
      ...question,
      translations: [{ code: "en", text: "Are you okay?" }],
    };
    questionService.create.mockResolvedValueOnce(question);

    // ACT
    const createdQuestion = questionResolver.createQuestion(createQuestionInput);

    // ASSERT
    expect(createdQuestion).resolves.toEqual(question);
  });

  it("get question", () => {
    // ARRANGE
    questionService.findOne.mockResolvedValueOnce(question);

    // ACT
    const foundQuestion = questionResolver.getQuestion(question.id);

    // ASSERT
    expect(foundQuestion).resolves.toEqual(question);
  });

  it("get questions", () => {
    // ARRANGE
    const questions = [question];
    questionService.findAll.mockResolvedValueOnce(questions);

    // ACT
    const foundQuestions = questionResolver.getQuestions();

    // ASSERT
    expect(foundQuestions).resolves.toEqual(questions);
  });

  it("update question", () => {
    // ARRANGE
    const updateQuestionInput: UpdateQuestionInput = {
      id: question.id,
      partNumber: 2,
    };
    questionService.update.mockResolvedValueOnce({ ...question, partNumber: updateQuestionInput.partNumber as number });

    // ACT
    const updatedQuestion = questionResolver.updateQuestion(updateQuestionInput);

    // ASSERT
    expect(updatedQuestion).resolves.toEqual({ ...question, partNumber: updateQuestionInput.partNumber });
  });

  it("update question texts", () => {
    // ARRANGE
    const updateQuestionTextsInput: UpdateQuestionTextsInput = {
      id: question.id,
      translations: [{ code: "en", text: "Are you okay bro?" }],
    };
    questionService.updateTexts.mockResolvedValueOnce({
      ...question,
      translations: updateQuestionTextsInput.translations.map((translation) => ({ ...translation, language })),
    });

    // ACT
    const updatedQuestionTexts = questionResolver.updateQuestionTexts(updateQuestionTextsInput);

    // ASSERT
    expect(updatedQuestionTexts).resolves.toEqual({
      ...question,
      translations: updateQuestionTextsInput.translations.map((translation) => ({ ...translation, language })),
    });
  });

  it("remove question", () => {
    // ARRANGE
    const deletedAt = new Date();
    questionService.remove.mockResolvedValueOnce({ ...question, deletedAt: deletedAt });

    // ACT
    const removedQuestion = questionResolver.removeQuestion(question.id);

    // ASSERT
    expect(removedQuestion).resolves.toEqual({ ...question, deletedAt: deletedAt });
  });
});
