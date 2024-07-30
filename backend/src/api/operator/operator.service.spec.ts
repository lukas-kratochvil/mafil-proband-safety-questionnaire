import { Test } from "@nestjs/testing";
import { OperatorRole, PrismaClient, type Operator } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "@app/prisma/prisma.service";
import type { CreateOperatorInput } from "./dto/create-operator.input";
import type { UpdateOperatorInput } from "./dto/update-operator.input";
import { OperatorService } from "./operator.service";

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
describe("OperatorService", () => {
  let operatorService: OperatorService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OperatorService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    operatorService = module.get<OperatorService>(OperatorService);
    prisma = module.get<PrismaService, DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it("create operator", () => {
    // ARRANGE
    const operatorInput: CreateOperatorInput = operator;
    prisma.operator.upsert.mockResolvedValueOnce(operator);

    // ACT
    const createdOperator = operatorService.create(operatorInput);

    // ASSERT
    expect(createdOperator).resolves.toStrictEqual(operator);
  });

  it("find all operators", () => {
    // ARRANGE
    const operators: Operator[] = [
      operator,
      {
        id: "2",
        name: "Marc",
        surname: "Smith",
        username: "marc.smith@mail.com",
        email: "marc.smith@mail.com",
        role: OperatorRole.MR_HIGH_PERM,
        isValid: true,
        lastLoggedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    prisma.operator.findMany.mockResolvedValueOnce(operators);

    // ACT
    const foundOperators = operatorService.findAll();

    // ASSERT
    expect(foundOperators).resolves.toStrictEqual(operators);
  });

  it("find operator", () => {
    // ARRANGE
    prisma.operator.findUniqueOrThrow.mockResolvedValueOnce(operator);

    // ACT
    const foundOperator = operatorService.findOne(operator.id);

    // ASSERT
    expect(foundOperator).resolves.toStrictEqual(operator);
  });

  it("update operator", () => {
    // ARRANGE
    const updateOperatorInput: UpdateOperatorInput = {
      ...operator,
      role: OperatorRole.MR_HIGH_PERM,
    };
    prisma.operator.update.mockResolvedValueOnce({
      ...operator,
      ...updateOperatorInput,
    });

    // ACT
    const updatedOperator = operatorService.update(updateOperatorInput.id, updateOperatorInput);

    // ASSERT
    expect(updatedOperator).resolves.toStrictEqual({
      ...operator,
      ...updateOperatorInput,
    });
  });

  it("remove operator", () => {
    // ARRANGE
    const deletedNow = new Date();
    prisma.operator.update.mockResolvedValueOnce({
      ...operator,
      deletedAt: deletedNow,
      isValid: false,
    });

    // ACT
    const removedOperator = operatorService.remove(operator.id);

    // ASSERT
    expect(removedOperator).resolves.toStrictEqual({
      ...operator,
      deletedAt: deletedNow,
      isValid: false,
    });
  });
});
