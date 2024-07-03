import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { QuestionTranslationService } from "./question-translation.service";

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

  it("should be defined", () => {
    expect(questionTranslationService).toBeDefined();
  });
});
