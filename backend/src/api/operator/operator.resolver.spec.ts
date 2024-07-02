import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthService } from "./auth.service";
import { AUTH_PRISMA_SERVICE, AUTH_SERVICE } from "./constants";
import { OperatorResolver } from "./operator.resolver";
import { OperatorService } from "./operator.service";

describe("OperatorResolver", () => {
  let operatorResolver: OperatorResolver;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperatorResolver,
        OperatorService,
        {
          provide: AUTH_SERVICE,
          useClass: AuthService,
        },
        {
          provide: AUTH_PRISMA_SERVICE,
          useClass: PrismaService,
        },
        PrismaService,
      ],
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
