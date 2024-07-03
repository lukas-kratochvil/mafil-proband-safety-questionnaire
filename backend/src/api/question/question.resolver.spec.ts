import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import { QuestionResolver } from "./question.resolver";
import { QuestionService } from "./question.service";

describe("QuestionResolver", () => {
  let questionResolver: QuestionResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [QuestionResolver, QuestionService, PrismaService, LanguageService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    questionResolver = module.get<QuestionResolver>(QuestionResolver);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(questionResolver).toBeDefined();
  });
});
