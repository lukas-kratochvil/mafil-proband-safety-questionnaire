import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Operator, OperatorRole } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthenticateOperatorArgs } from "./dto/authenticate-operator.args";
import { CreateOperatorInput } from "./dto/create-operator.input";
import { UpdateOperatorInput } from "./dto/update-operator.input";

@Injectable()
export class OperatorService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(OperatorService.name);

  getUserChangedData(operator: Operator, authenticateOperatorArgs: AuthenticateOperatorArgs): string[] {
    const changedData = [];

    if (operator.name !== authenticateOperatorArgs.name) {
      changedData.push(`name ('${operator.name}' -> '${authenticateOperatorArgs.name}')`);
    }
    if (operator.surname !== authenticateOperatorArgs.surname) {
      changedData.push(`surname ('${operator.surname}' -> '${authenticateOperatorArgs.surname}')`);
    }
    if (operator.email !== authenticateOperatorArgs.email) {
      changedData.push(`email ('${operator.email}' -> '${authenticateOperatorArgs.email}')`);
    }

    return changedData;
  }

  async authenticate(authenticateOperatorArgs: AuthenticateOperatorArgs): Promise<Operator | never> {
    const operator = await this.prisma.operator.findUniqueOrThrow({
      where: {
        username: authenticateOperatorArgs.username,
      },
    });

    if (!operator.isValid) {
      this.logger.error(`Operator [${operator.username}] is invalid!`);
      throw new UnauthorizedException("Operator is invalid!");
    }

    const userChangedData = this.getUserChangedData(operator, authenticateOperatorArgs);

    if (userChangedData.length === 0) {
      this.logger.log(`Operator [${operator.username}] authenticated.`);
      return operator;
    }

    this.logger.error(`Operator [${operator.username}] data changed: ${userChangedData.join(", ")}!`);
    throw new UnauthorizedException("Invalid operator login data!");
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
