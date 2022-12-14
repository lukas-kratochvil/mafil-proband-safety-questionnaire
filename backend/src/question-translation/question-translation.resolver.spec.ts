import { Test, TestingModule } from "@nestjs/testing";
import { QuestionTranslationResolver } from "./question-translation.resolver";
import { QuestionTranslationService } from "./question-translation.service";

describe("QuestionTranslationResolver", () => {
  let resolver: QuestionTranslationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionTranslationResolver, QuestionTranslationService],
    }).compile();

    resolver = module.get<QuestionTranslationResolver>(QuestionTranslationResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
