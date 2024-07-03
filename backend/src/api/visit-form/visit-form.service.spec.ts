import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { VisitFormService } from "./visit-form.service";

describe("VisitFormService", () => {
  let visitFormService: VisitFormService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VisitFormService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    visitFormService = module.get<VisitFormService>(VisitFormService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(visitFormService).toBeDefined();
  });
});
