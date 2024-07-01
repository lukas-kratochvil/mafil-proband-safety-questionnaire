import { Test, TestingModule } from "@nestjs/testing";
import type { PrismaClient } from "@prisma/client";
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let authService: AuthService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });
});
