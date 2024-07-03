import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import { QuestionService } from "./question.service";

describe("QuestionService", () => {
  let questionService: QuestionService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [QuestionService, PrismaService, LanguageService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    questionService = module.get<QuestionService>(QuestionService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(questionService).toBeDefined();
  });
});
