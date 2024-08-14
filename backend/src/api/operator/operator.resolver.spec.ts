import { Test } from "@nestjs/testing";
import { OperatorRole, type Operator } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthService } from "./auth.service";
import { AUTH_PRISMA_SERVICE, AUTH_SERVICE } from "./constants";
import type { AuthenticateOperatorArgs } from "./dto/authenticate-operator.args";
import type { CreateOperatorInput } from "./dto/create-operator.input";
import type { UpdateOperatorInput } from "./dto/update-operator.input";
import { OperatorResolver } from "./operator.resolver";
import { OperatorService } from "./operator.service";

//----------------------------------------------------------------------
// Test data
//----------------------------------------------------------------------
const operator: Operator = {
  id: "1",
  name: "Adam",
  surname: "Song",
  username: "adam.song",
  email: "adam.song@mail.com",
  role: "MR",
  isValid: true,
  lastLoggedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

//----------------------------------------------------------------------
// Tests
//----------------------------------------------------------------------
describe("OperatorResolver", () => {
  let operatorResolver: OperatorResolver;
  let operatorService: DeepMockProxy<OperatorService>;
  let authService: DeepMockProxy<AuthService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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
      ],
    })
      .overrideProvider(OperatorService)
      .useValue(mockDeep<OperatorService>())
      .overrideProvider(AUTH_SERVICE)
      .useValue(mockDeep<AuthService>())
      .compile();

    operatorResolver = module.get<OperatorResolver>(OperatorResolver);
    operatorService = module.get<OperatorService, DeepMockProxy<OperatorService>>(OperatorService);
    authService = module.get<AuthService, DeepMockProxy<AuthService>>(AUTH_SERVICE);
  });

  it("authenticate operator", () => {
    // ARRANGE
    const authenticateOperatorArgs: AuthenticateOperatorArgs = { ...operator };
    authService.authenticate.mockResolvedValueOnce(operator);

    // ACT
    const createdOperator = operatorResolver.authenticateOperator(authenticateOperatorArgs);

    // ASSERT
    expect(createdOperator).resolves.toEqual(operator);
  });

  it("create operator", () => {
    // ARRANGE
    const createOperatorInput: CreateOperatorInput = { ...operator };
    operatorService.create.mockResolvedValueOnce(operator);

    // ACT
    const createdOperator = operatorResolver.createOperator(createOperatorInput);

    // ASSERT
    expect(createdOperator).resolves.toEqual(operator);
  });

  it("get operator", () => {
    // ARRANGE
    operatorService.findOne.mockResolvedValueOnce(operator);

    // ACT
    const foundOperator = operatorResolver.getOperator(operator.username);

    // ASSERT
    expect(foundOperator).resolves.toEqual(operator);
  });

  it("get operators", () => {
    // ARRANGE
    const operators = [operator];
    operatorService.findAll.mockResolvedValueOnce(operators);

    // ACT
    const foundOperators = operatorResolver.getOperators();

    // ASSERT
    expect(foundOperators).resolves.toEqual(operators);
  });

  it("update operator", () => {
    // ARRANGE
    const updateOperatorInput: UpdateOperatorInput = {
      id: operator.id,
      role: OperatorRole.MR_HIGH_PERM,
    };
    operatorService.update.mockResolvedValueOnce({ ...operator, role: updateOperatorInput.role as OperatorRole });

    // ACT
    const updatedOperator = operatorResolver.updateOperator(updateOperatorInput);

    // ASSERT
    expect(updatedOperator).resolves.toEqual({ ...operator, role: updateOperatorInput.role });
  });

  it("remove operator", () => {
    // ARRANGE
    const deletedAt = new Date();
    operatorService.remove.mockResolvedValueOnce({ ...operator, deletedAt: deletedAt });

    // ACT
    const removedOperator = operatorResolver.removeOperator(operator.id);

    // ASSERT
    expect(removedOperator).resolves.toEqual({ ...operator, deletedAt: deletedAt });
  });
});
