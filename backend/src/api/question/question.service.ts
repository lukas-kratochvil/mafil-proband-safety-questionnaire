import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { LanguageService } from "@app/api/language/language.service";
import { areTranslationsComplete, translationsIncludeSchema } from "@app/api/utils/utils";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateQuestionInput } from "./dto/create-question.input";
import { UpdateQuestionTextsInput } from "./dto/update-question-texts.input";
import { UpdateQuestionInput } from "./dto/update-question.input";

const questionInclude = Prisma.validator<Prisma.QuestionInclude>()({
  ...translationsIncludeSchema,
  hiddenByGenders: true,
});

const questionTranslationsArgs = Prisma.validator<Prisma.QuestionDefaultArgs>()({
  include: questionInclude,
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
        include: questionInclude,
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
      include: questionInclude,
    });
  }

  async findOne(id: string): Promise<QuestionIncludingTranslations> {
    return this.prisma.question.findUniqueOrThrow({
      where: {
        id,
      },
      include: questionInclude,
    });
  }

  async update(id: string, updateQuestionInput: UpdateQuestionInput): Promise<QuestionIncludingTranslations> {
    return this.prisma.question.update({
      where: {
        id,
      },
      data: updateQuestionInput,
      include: questionInclude,
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
        include: questionInclude,
      });
      return this.prisma.question.create({
        data: {
          isValid: true,
          partNumber: updateQuestionTextsInput.partNumber
            ? updateQuestionTextsInput.partNumber
            : previousQuestion.partNumber,
          mustBeApproved: updateQuestionTextsInput.partNumber === 2 ? true : previousQuestion.mustBeApproved,
          order: previousQuestion.order,
          previousQuestion: {
            connect: {
              id: previousQuestion.id,
            },
          },
          hiddenByGenders:
            previousQuestion.hiddenByGenders.length === 0
              ? undefined
              : {
                  createMany: {
                    data: previousQuestion.hiddenByGenders.map((hbg) => ({ genderCode: hbg.genderCode })),
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
        include: questionInclude,
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
      include: questionInclude,
    });
  }
}
