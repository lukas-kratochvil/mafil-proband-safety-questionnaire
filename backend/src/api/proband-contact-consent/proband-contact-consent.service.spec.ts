import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { ProbandContactConsentService } from "./proband-contact-consent.service";

describe("ProbandContactConsentService", () => {
  let probandContactConsentService: ProbandContactConsentService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProbandContactConsentService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    probandContactConsentService = module.get<ProbandContactConsentService>(ProbandContactConsentService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(probandContactConsentService).toBeDefined();
  });
});
