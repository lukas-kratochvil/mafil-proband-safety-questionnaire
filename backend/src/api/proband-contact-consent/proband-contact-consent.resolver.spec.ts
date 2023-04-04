import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { ProbandContactConsentResolver } from "./proband-contact-consent.resolver";

describe("ProbandContactConsentResolver", () => {
  let probandContactConsentResolver: ProbandContactConsentResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProbandContactConsentResolver, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    probandContactConsentResolver = module.get<ProbandContactConsentResolver>(ProbandContactConsentResolver);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(probandContactConsentResolver).toBeDefined();
  });
});
