import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { LanguageResolver } from "./language.resolver";
import { LanguageService } from "./language.service";

describe("LanguageResolver", () => {
  let languageResolver: LanguageResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LanguageResolver, LanguageService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    languageResolver = module.get<LanguageResolver>(LanguageResolver);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(languageResolver).toBeDefined();
  });
});
