import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { OperatorRole, type Operator, type PrismaClient } from "@prisma/client";
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthService } from "./auth.service";
import { AUTH_PRISMA_SERVICE } from "./constants";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const operator: Operator = {
  id: "1",
  name: "John",
  surname: "Smith",
  username: "john.smith@mail.com",
  email: "john.smith@mail.com",
  role: OperatorRole.MR,
  isValid: true,
  lastLoggedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("AuthService", () => {
  let authService: AuthService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AUTH_PRISMA_SERVICE,
          useClass: PrismaService,
        },
      ],
    })
      .overrideProvider(AUTH_PRISMA_SERVICE)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    // turn off logging
    module.useLogger(false);

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(AUTH_PRISMA_SERVICE);
  });

  describe("authentication", () => {
    it("operator authenticated", () => {
      // ARRANGE
      const lastLoggedAt = new Date();
      vi.spyOn(authService, "verify").mockResolvedValueOnce(operator);
      prisma.operator.update.mockResolvedValueOnce({ ...operator, lastLoggedAt });

      // ACT
      const foundOperator = authService.authenticate(operator.username, { ...operator });

      // ASSERT
      expect(foundOperator).resolves.toStrictEqual({ ...operator, lastLoggedAt });
    });

    it("operator is unknown or invalid", () => {
      // ARRANGE
      vi.spyOn(authService, "verify").mockRejectedValueOnce(new UnauthorizedException());

      // ACT
      const foundOperator = authService.authenticate(operator.username, { ...operator });

      // ASSERT
      expect(foundOperator).rejects.toThrow(UnauthorizedException);
    });

    it("operator changed data", () => {
      // ARRANGE
      const lastLoggedAt = new Date();
      const changedOperator = {
        ...operator,
        name: `${operator.name}_X`,
        surname: `${operator.surname}_X`,
        email: `${operator.email}_X`,
        lastLoggedAt,
      };
      vi.spyOn(authService, "verify").mockResolvedValueOnce(operator);
      prisma.operator.update
        .mockResolvedValueOnce({ ...operator, lastLoggedAt })
        .mockResolvedValueOnce(changedOperator);

      // ACT
      const foundOperator = authService.authenticate(changedOperator.username, { ...changedOperator });

      // ASSERT
      expect(foundOperator).resolves.toStrictEqual(changedOperator);
    });
  });

  describe("verification", () => {
    it("operator verified", () => {
      // ARRANGE
      prisma.operator.findUnique.mockResolvedValueOnce(operator);

      // ACT
      const foundOperator = authService.verify(operator.username);

      // ASSERT
      expect(foundOperator).resolves.toStrictEqual(operator);
    });

    it("operator not verified", () => {
      // ARRANGE
      prisma.operator.findUnique.mockResolvedValueOnce(null);

      // ACT
      const foundOperator = authService.verify(operator.username);

      // ASSERT
      expect(foundOperator).rejects.toThrow(UnauthorizedException);
    });
  });
});
