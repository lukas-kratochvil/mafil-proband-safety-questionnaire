import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { VisitFormResolver } from "./visit-form.resolver";
import { VisitFormService } from "./visit-form.service";

describe("VisitFormResolver", () => {
  let visitFormResolver: VisitFormResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VisitFormResolver, VisitFormService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    visitFormResolver = module.get<VisitFormResolver>(VisitFormResolver);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(visitFormResolver).toBeDefined();
  });
});
