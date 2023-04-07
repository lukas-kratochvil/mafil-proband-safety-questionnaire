import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { LanguageService } from "@app/api/language/language.service";
import { areTranslationsComplete, translationsIncludeSchema } from "@app/api/utils/utils";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateQuestionInput } from "./dto/create-question.input";
import { UpdateQuestionTextsInput } from "./dto/update-question-texts.input";
import { UpdateQuestionInput } from "./dto/update-question.input";

const questionTranslations = Prisma.validator<Prisma.QuestionInclude>()({
  ...translationsIncludeSchema,
  hiddenByGenders: true,
});

const questionTranslationsArgs = Prisma.validator<Prisma.QuestionArgs>()({
  include: questionTranslations,
});

type QuestionIncludingTranslations = Prisma.QuestionGetPayload<typeof questionTranslationsArgs>;

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService, private readonly languageService: LanguageService) {}

  async create(createQuestionInput: CreateQuestionInput): Promise<QuestionIncludingTranslations | never> {
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
        include: questionTranslations,
      });
    }

    throw new BadRequestException("Question doesn't contain all the possible translations!");
  }

  async findAll(): Promise<QuestionIncludingTranslations[]> {
    return this.prisma.question.findMany({
      where: {
        isValid: true,
        deletedAt: null,
      },
      include: questionTranslations,
    });
  }

  async findOne(id: string): Promise<QuestionIncludingTranslations> {
    return this.prisma.question.findUniqueOrThrow({
      where: {
        id,
      },
      include: questionTranslations,
    });
  }

  async update(id: string, updateQuestionInput: UpdateQuestionInput): Promise<QuestionIncludingTranslations> {
    return this.prisma.question.update({
      where: {
        id,
      },
      data: updateQuestionInput,
      include: questionTranslations,
    });
  }

  async updateTexts(
    id: string,
    updateQuestionTextsInput: UpdateQuestionTextsInput
  ): Promise<QuestionIncludingTranslations | never> {
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
        include: questionTranslations,
      });
    }

    throw new BadRequestException("Question contains invalid locales!");
  }

  async remove(id: string): Promise<QuestionIncludingTranslations> {
    return this.prisma.question.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        isValid: false,
      },
      include: questionTranslations,
    });
  }
}
