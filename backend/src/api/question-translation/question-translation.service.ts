import { Injectable } from "@nestjs/common";
import { QuestionTranslation } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateQuestionTranslationInput } from "./dto/create-question-translation.input";
import { UpdateQuestionTranslationInput } from "./dto/update-question-translation.input";

@Injectable()
export class QuestionTranslationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuestionTranslationInput: CreateQuestionTranslationInput): Promise<QuestionTranslation> {
    return this.prisma.questionTranslation.create({
      data: createQuestionTranslationInput,
    });
  }

  async update(
    id: string,
    updateQuestionTranslationInput: UpdateQuestionTranslationInput
  ): Promise<QuestionTranslation> {
    return this.prisma.questionTranslation.update({
      where: {
        id,
      },
      data: updateQuestionTranslationInput,
    });
  }
}
