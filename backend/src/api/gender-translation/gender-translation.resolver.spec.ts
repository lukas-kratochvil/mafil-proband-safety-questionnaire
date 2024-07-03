import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { GenderTranslationResolver } from "./gender-translation.resolver";
import { GenderTranslationService } from "./gender-translation.service";

describe("GenderTranslationResolver", () => {
  let genderTranslationResolver: GenderTranslationResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GenderTranslationResolver, GenderTranslationService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    genderTranslationResolver = module.get<GenderTranslationResolver>(GenderTranslationResolver);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(genderTranslationResolver).toBeDefined();
  });
});
