import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { HandednessTranslationService } from "./handedness-translation.service";

describe("HandednessTranslationService", () => {
  let handednessTranslationService: HandednessTranslationService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HandednessTranslationService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    handednessTranslationService = module.get<HandednessTranslationService>(HandednessTranslationService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(handednessTranslationService).toBeDefined();
  });
});
