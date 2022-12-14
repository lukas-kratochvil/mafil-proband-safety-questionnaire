import { Test, TestingModule } from "@nestjs/testing";
import { QuestionTranslationService } from "./question-translation.service";

describe("QuestionTranslationService", () => {
  let service: QuestionTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionTranslationService],
    }).compile();

    service = module.get<QuestionTranslationService>(QuestionTranslationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
