import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { QuestionTranslationResolver } from "./question-translation.resolver";
import { QuestionTranslationService } from "./question-translation.service";

describe("QuestionTranslationResolver", () => {
  let questionTranslationResolver: QuestionTranslationResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionTranslationResolver, QuestionTranslationService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    questionTranslationResolver = module.get<QuestionTranslationResolver>(QuestionTranslationResolver);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(questionTranslationResolver).toBeDefined();
  });
});
