import { ForbiddenException, Injectable } from "@nestjs/common";
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
      where: {
        uco: authenticateOperatorArgs.uco,
      },
    });

    if (
      operator.name !== authenticateOperatorArgs.name
      || operator.surname !== authenticateOperatorArgs.surname
      || operator.email !== authenticateOperatorArgs.email
      || !operator.isValid
    ) {
      throw new ForbiddenException("Invalid operator login data!");
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

  async findOne(uco: string): Promise<Operator> {
    return this.prisma.operator.findUniqueOrThrow({
      where: {
        uco,
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
