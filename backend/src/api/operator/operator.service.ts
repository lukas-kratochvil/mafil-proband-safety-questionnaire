import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Operator, OperatorRole, type Prisma } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthenticateOperatorArgs } from "./dto/authenticate-operator.args";
import { CreateOperatorInput } from "./dto/create-operator.input";
import { UpdateOperatorInput } from "./dto/update-operator.input";

const getChangedAttrStr = (
  attrName: keyof Operator,
  operator: Operator,
  updatedOperatorData: Prisma.OperatorUpdateInput
) => `${attrName} ('${operator[attrName]}' -> '${updatedOperatorData[attrName]}')`;

const getOperatorChangedDataStr = (operator: Operator, updatedOperatorData: Prisma.OperatorUpdateInput) => {
  const changedData = [];

  if (updatedOperatorData.name && operator.name !== updatedOperatorData.name) {
    changedData.push(getChangedAttrStr("name", operator, updatedOperatorData));
  }
  if (updatedOperatorData.surname && operator.surname !== updatedOperatorData.surname) {
    changedData.push(getChangedAttrStr("surname", operator, updatedOperatorData));
  }
  if (updatedOperatorData.email && operator.email !== updatedOperatorData.email) {
    changedData.push(getChangedAttrStr("email", operator, updatedOperatorData));
  }

  return changedData.join(", ");
};

@Injectable()
export class OperatorService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(OperatorService.name);

  async authenticate(authenticateOperatorArgs: AuthenticateOperatorArgs): Promise<Operator | never> {
    let operator: Operator;

    try {
      operator = await this.prisma.operator.findUniqueOrThrow({
        where: {
          username: authenticateOperatorArgs.username,
        },
      });
    } catch (e) {
      this.logger.error(`Operator "${authenticateOperatorArgs.username}" is unknown!`);
      throw e;
    }

    if (!operator.isValid) {
      this.logger.error(`Operator "${operator.username}" is invalid!`);
      throw new UnauthorizedException("Operator is invalid!");
    }

    this.logger.log(`Operator "${operator.username}" authenticated.`);
    operator = await this.prisma.operator.update({
      where: {
        id: operator.id,
      },
      data: {
        lastLoggedAt: new Date(),
      },
    });

    // Update operator data if changed
    const updatedOperatorData: Prisma.OperatorUpdateInput = {};

    if (authenticateOperatorArgs.name !== operator.name) {
      updatedOperatorData.name = authenticateOperatorArgs.name;
    }
    if (authenticateOperatorArgs.surname !== operator.surname) {
      updatedOperatorData.surname = authenticateOperatorArgs.surname;
    }
    if (authenticateOperatorArgs.email !== operator.email) {
      updatedOperatorData.email = authenticateOperatorArgs.email;
    }

    // Check if any operator data needs updating. If not, return operator, else update operator properties.
    if (Object.keys(updatedOperatorData).length == 0) {
      return operator;
    }

    const operatorChangedData = getOperatorChangedDataStr(operator, updatedOperatorData);
    this.logger.error(`Operator "${operator.username}" data changed: ${operatorChangedData}!`);
    return this.prisma.operator.update({
      where: {
        username: authenticateOperatorArgs.username,
      },
      data: updatedOperatorData,
    });
  }

  async create(createOperatorInput: CreateOperatorInput): Promise<Operator> {
    return this.prisma.operator.upsert({
      where: {
        username: createOperatorInput.username,
      },
      update: {
        ...createOperatorInput,
        isValid: true,
      },
      create: {
        ...createOperatorInput,
        role: createOperatorInput.role ?? OperatorRole.MR,
      },
    });
  }

  async findAll(): Promise<Operator[]> {
    return this.prisma.operator.findMany();
  }

  async findOne(username: string): Promise<Operator> {
    return this.prisma.operator.findUniqueOrThrow({
      where: {
        username,
      },
    });
  }

  async update(id: string, updateOperatorInput: UpdateOperatorInput): Promise<Operator> {
    return this.prisma.operator.update({
      where: {
        id,
      },
      data: updateOperatorInput,
    });
  }

  async remove(id: string): Promise<Operator> {
    return this.prisma.operator.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        isValid: false,
      },
    });
  }
}
