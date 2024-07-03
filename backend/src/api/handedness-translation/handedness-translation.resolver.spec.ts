import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { HandednessTranslationResolver } from "./handedness-translation.resolver";
import { HandednessTranslationService } from "./handedness-translation.service";

describe("HandednessTranslationResolver", () => {
  let handednessTranslationResolver: HandednessTranslationResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HandednessTranslationResolver, HandednessTranslationService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    handednessTranslationResolver = module.get<HandednessTranslationResolver>(HandednessTranslationResolver);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(handednessTranslationResolver).toBeDefined();
  });
});
