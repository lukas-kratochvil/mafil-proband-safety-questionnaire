import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { OperatorRole, type Operator, type PrismaClient } from "@prisma/client";
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";
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

  it.only("authenticate operator", () => {
    // ARRANGE
    const lastLoggedAt = new Date();
    jest.spyOn(authService, "verify").mockResolvedValueOnce(operator);
    prisma.operator.update.mockResolvedValueOnce({ ...operator, lastLoggedAt });

    // ACT
    const foundOperator = authService.authenticate(operator.username, { ...operator });

    // ASSERT
    expect(foundOperator).resolves.toStrictEqual({ ...operator, lastLoggedAt });
  });

  it("authenticate operator - operator not found", () => {
    // ARRANGE
    jest.spyOn(authService, "verify").mockResolvedValueOnce(operator);

    // ACT
    const foundOperator = authService.authenticate(operator.username, { ...operator });

    // ASSERT
    expect(foundOperator).rejects.toThrow(Error);
  });

  it("authenticate operator - operator not valid", () => {
    // ARRANGE
    const invalidOperator = {
      ...operator,
      isValid: false,
    };
    jest.spyOn(authService, "verify").mockResolvedValueOnce(invalidOperator);

    // ACT
    const foundOperator = authService.authenticate(operator.username, { ...operator });

    // ASSERT
    expect(foundOperator).rejects.toThrow(UnauthorizedException);
  });

  it("authenticate operator - changed operator data", () => {
    // ARRANGE
    const changedOperator = {
      ...operator,
      name: `${operator.name}_X`,
      surname: `${operator.surname}_X`,
      email: `${operator.email}_X`,
    };
    prisma.operator.findUniqueOrThrow.mockResolvedValueOnce(operator);
    prisma.operator.update.mockResolvedValueOnce(changedOperator);

    // ACT
    const foundOperator = authService.authenticate(changedOperator.username, { ...changedOperator });

    // ASSERT
    expect(foundOperator).resolves.toStrictEqual(changedOperator);
  });

  it("verify operator", () => {
    // ARRANGE
    prisma.operator.findUniqueOrThrow.mockResolvedValueOnce(operator);

    // ACT
    const foundOperator = authService.verify(operator.username);

    // ASSERT
    expect(foundOperator).resolves.toStrictEqual(operator);
  });
});
