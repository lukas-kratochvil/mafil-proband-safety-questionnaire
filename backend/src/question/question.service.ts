import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { LanguageService } from "@language/language.service";
import { PrismaService } from "@prisma/prisma.service";
import { areTranslationsComplete } from "@utils/utils";
import { CreateQuestionInput } from "./dto/create-question.input";
import { UpdateQuestionTextsInput } from "./dto/update-question-texts.input";
import { UpdateQuestionInput } from "./dto/update-question.input";

const questionTranslationsInclude = Prisma.validator<Prisma.QuestionInclude>()({
  translations: {
    select: {
      text: true,
      language: {
        select: {
          name: true,
          code: true,
        },
      },
    },
  },
});

const questionTranslationsArgs = Prisma.validator<Prisma.QuestionArgs>()({
  include: questionTranslationsInclude,
});

type QuestionTranslationsInclude = Prisma.QuestionGetPayload<typeof questionTranslationsArgs>;

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService, private readonly languageService: LanguageService) {}

  async create(createQuestionInput: CreateQuestionInput): Promise<QuestionTranslationsInclude> {
    const languages = await this.languageService.findAll();

    if (areTranslationsComplete(languages, createQuestionInput.translations)) {
      return this.prisma.question.create({
        data: {
          ...createQuestionInput,
          isValid: true,
          mustBeApproved: createQuestionInput.partNumber === 2,
          translations: {
            createMany: {
              data: createQuestionInput.translations.map((translation) => ({
                languageId: languages.find((language) => language.code === translation.code)?.id as string,
                text: translation.text,
              })),
            },
          },
        },
        include: questionTranslationsInclude,
      });
    }

    throw new Error("Question doesn't contain all the possible translations!");
  }

  async findAll(): Promise<QuestionTranslationsInclude[]> {
    return this.prisma.question.findMany({
      where: {
        isValid: true,
        deletedAt: null,
      },
      include: questionTranslationsInclude,
    });
  }

  async findOne(id: string): Promise<QuestionTranslationsInclude> {
    return this.prisma.question.findUniqueOrThrow({
      where: {
        id,
      },
      include: questionTranslationsInclude,
    });
  }

  async update(id: string, updateQuestionInput: UpdateQuestionInput): Promise<QuestionTranslationsInclude> {
    return this.prisma.question.update({
      where: {
        id,
      },
      data: updateQuestionInput,
      include: questionTranslationsInclude,
    });
  }

  async updateTexts(
    id: string,
    updateQuestionTextsInput: UpdateQuestionTextsInput
  ): Promise<QuestionTranslationsInclude> {
    const languages = await this.languageService.findAll();

    if (areTranslationsComplete(languages, updateQuestionTextsInput.translations)) {
      const previousQuestion = await this.prisma.question.update({
        where: {
          id,
        },
        data: {
          isValid: false,
        },
      });
      return this.prisma.question.create({
        data: {
          isValid: true,
          partNumber: updateQuestionTextsInput.partNumber
            ? updateQuestionTextsInput.partNumber
            : previousQuestion.partNumber,
          mustBeApproved: updateQuestionTextsInput.partNumber === 2 ? true : previousQuestion.mustBeApproved,
          previousQuestion: {
            connect: {
              id: previousQuestion.id,
            },
          },
          translations: {
            createMany: {
              data: updateQuestionTextsInput.translations.map((translation) => ({
                languageId: languages.find((language) => language.code === translation.code)?.id as string,
                text: translation.text,
              })),
            },
          },
        },
        include: questionTranslationsInclude,
      });
    }

    throw new Error("Question doesn't contain all the possible translations!");
  }

  async remove(id: string): Promise<QuestionTranslationsInclude> {
    return this.prisma.question.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        isValid: false,
      },
      include: questionTranslationsInclude,
    });
  }
}
