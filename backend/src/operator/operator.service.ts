import { Injectable } from "@nestjs/common";
import { Operator, OperatorRole } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { CreateOperatorInput } from "./dto/create-operator.input";
import { UpdateOperatorInput } from "./dto/update-operator.input";

@Injectable()
export class OperatorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOperatorInput: CreateOperatorInput): Promise<Operator> {
    const operator = this.prismaService.operator.findUnique({
      where: {
        uco: createOperatorInput.uco,
      },
    });

    if (operator === undefined) {
      return this.prismaService.operator.create({
        data: {
          ...createOperatorInput,
          role: createOperatorInput.role ?? OperatorRole.MR,
        },
      });
    }

    return this.prismaService.operator.update({
      where: {
        uco: createOperatorInput.uco,
      },
      data: {
        ...createOperatorInput,
        isValid: true,
      },
    });
  }

  async findAll(): Promise<Operator[]> {
    return this.prismaService.operator.findMany();
  }

  async findOne(id: string): Promise<Operator> {
    return this.prismaService.operator.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateOperatorInput: UpdateOperatorInput): Promise<Operator> {
    const operator = await this.prismaService.operator.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return this.prismaService.operator.update({
      where: {
        id,
      },
      data: {
        ...updateOperatorInput,
        role: updateOperatorInput.role ?? operator.role,
      },
    });
  }

  async remove(id: string): Promise<Operator> {
    return this.prismaService.operator.update({
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
