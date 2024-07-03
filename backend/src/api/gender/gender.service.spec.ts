import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { LanguageService } from "@app/api/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import { GenderService } from "./gender.service";

describe("GenderService", () => {
  let genderService: GenderService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GenderService, PrismaService, LanguageService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    genderService = module.get<GenderService>(GenderService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(genderService).toBeDefined();
  });
});
