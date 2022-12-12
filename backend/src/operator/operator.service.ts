import { Injectable } from "@nestjs/common";
import { OperatorRole } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { CreateOperatorInput } from "./dto/create-operator.input";
import { UpdateOperatorInput } from "./dto/update-operator.input";

@Injectable()
export class OperatorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOperatorInput: CreateOperatorInput) {
    return await this.prismaService.operator.create({
      data: {
        ...createOperatorInput,
        role: createOperatorInput.role ?? OperatorRole.MR,
      },
    });
  }

  async findAll() {
    return await this.prismaService.operator.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.operator.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateOperatorInput: UpdateOperatorInput) {
    const operator = await this.prismaService.operator.findUnique({
      where: {
        id,
      },
    });

    return await this.prismaService.operator.update({
      where: {
        id,
      },
      data: {
        ...updateOperatorInput,
        role: updateOperatorInput.role ?? operator?.role,
      },
    });
  }

  async remove(id: string) {
    return await this.prismaService.operator.update({
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
