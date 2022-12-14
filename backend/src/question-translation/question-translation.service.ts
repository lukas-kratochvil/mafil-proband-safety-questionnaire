import { Injectable } from "@nestjs/common";
import { QuestionTranslation } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { CreateQuestionTranslationInput } from "./dto/create-question-translation.input";
import { UpdateQuestionTranslationInput } from "./dto/update-question-translation.input";

@Injectable()
export class QuestionTranslationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createQuestionTranslationInput: CreateQuestionTranslationInput): Promise<QuestionTranslation> {
    return this.prismaService.questionTranslation.create({
      data: createQuestionTranslationInput,
    });
  }

  async update(
    id: string,
    updateQuestionTranslationInput: UpdateQuestionTranslationInput
  ): Promise<QuestionTranslation> {
    return this.prismaService.questionTranslation.update({
      where: {
        id,
      },
      data: updateQuestionTranslationInput,
    });
  }
}
