import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { OperatorResolver } from "./operator.resolver";
import { OperatorService } from "./operator.service";

describe("OperatorResolver", () => {
  let operatorResolver: OperatorResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperatorResolver, OperatorService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    operatorResolver = module.get<OperatorResolver>(OperatorResolver);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(operatorResolver).toBeDefined();
  });
});
