import { Injectable } from "@nestjs/common";
import { Operator, OperatorRole } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { AuthenticateOperatorArgs } from "./dto/authenticate-operator.args";
import { CreateOperatorInput } from "./dto/create-operator.input";
import { UpdateOperatorInput } from "./dto/update-operator.input";

@Injectable()
export class OperatorService {
  constructor(private readonly prisma: PrismaService) {}

  async authenticate(authenticateOperatorArgs: AuthenticateOperatorArgs): Promise<Operator | never> {
    const operator = await this.prisma.operator.findUniqueOrThrow({
      where: authenticateOperatorArgs,
    });

    if (!operator.isValid) {
      throw new Error("Operator cannot be authenticated!");
    }

    return operator;
  }

  async create(createOperatorInput: CreateOperatorInput): Promise<Operator> {
    return this.prisma.operator.upsert({
      where: {
        uco: createOperatorInput.uco,
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

  async findOne(id: string): Promise<Operator> {
    return this.prisma.operator.findUniqueOrThrow({
      where: {
        id,
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
