import { Injectable } from "@nestjs/common";
import { Question } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { CreateQuestionInput } from "./dto/create-question.input";
import { UpdateQuestionInput } from "./dto/update-question.input";

@Injectable()
export class QuestionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    return this.prismaService.question.create({
      data: {
        ...createQuestionInput,
        isValid: true,
        mustBeApproved: createQuestionInput.partNumber === 2,
      },
    });
  }

  async findAll(): Promise<Question[]> {
    return this.prismaService.question.findMany({
      where: {
        isValid: true,
        deletedAt: null,
      },
    });
  }

  async findOne(id: string): Promise<Question> {
    return this.prismaService.question.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateQuestionInput: UpdateQuestionInput): Promise<Question> {
    const previousQuestion = await this.prismaService.question.update({
      where: {
        id,
      },
      data: {
        isValid: false,
      },
    });
    return this.prismaService.question.create({
      data: {
        isValid: true,
        partNumber: updateQuestionInput.partNumber ? updateQuestionInput.partNumber : previousQuestion.partNumber,
        mustBeApproved: updateQuestionInput.partNumber === 2 ? true : previousQuestion.mustBeApproved,
        previousQuestion: {
          connect: {
            id: previousQuestion.id,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Question> {
    return this.prismaService.question.update({
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
