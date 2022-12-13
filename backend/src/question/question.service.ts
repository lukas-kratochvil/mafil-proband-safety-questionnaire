import { Injectable } from "@nestjs/common";
import { Language, Prisma, Question } from "@prisma/client";
import { LanguageService } from "@language/language.service";
import { PrismaService } from "@prisma/prisma.service";
import { CreateQuestionInput, CreateQuestionTranslationsInput } from "./dto/create-question.input";
import { UpdateQuestionInput } from "./dto/update-question.input";

const areTranslationsComplete = (languages: Language[], translations: CreateQuestionTranslationsInput[]): boolean => {
  const translationLocales = translations.map((translation) => translation.locale);
  return languages.map((language) => language.locale).every((locale) => translationLocales.includes(locale));
};

const questionTranslations = Prisma.validator<Prisma.QuestionInclude>()({
  translations: {
    select: {
      text: true,
    },
    include: {
      language: {
        select: {
          name: true,
          locale: true,
        },
      },
    },
  },
});

@Injectable()
export class QuestionService {
  constructor(private readonly prismaService: PrismaService, private readonly languageService: LanguageService) {}

  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    const languages = await this.languageService.findAll();

    if (areTranslationsComplete(languages, createQuestionInput.translations)) {
      return this.prismaService.question.create({
        data: {
          ...createQuestionInput,
          isValid: true,
          mustBeApproved: createQuestionInput.partNumber === 2,
          translations: {
            createMany: {
              data: createQuestionInput.translations.map((translation) => ({
                languageId: languages.find((language) => language.locale === translation.locale)?.id as string,
                text: translation.text,
              })),
            },
          },
        },
        include: questionTranslations,
      });
    }

    throw new Error("Question doesn't contain all the possible translations!");
  }

  async findAll(): Promise<Question[]> {
    return this.prismaService.question.findMany({
      where: {
        isValid: true,
        deletedAt: null,
      },
      include: questionTranslations,
    });
  }

  async findOne(id: string): Promise<Question> {
    return this.prismaService.question.findUniqueOrThrow({
      where: {
        id,
      },
      include: questionTranslations,
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
    const languages = await this.languageService.findAll();

    if (areTranslationsComplete(languages, updateQuestionInput.translations)) {
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
          translations: {
            createMany: {
              data: updateQuestionInput.translations.map((translation) => ({
                languageId: languages.find((language) => language.locale === translation.locale)?.id as string,
                text: translation.text,
              })),
            },
          },
        },
        include: questionTranslations,
      });
    }

    throw new Error("Question doesn't contain all the possible translations!");
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
      include: questionTranslations,
    });
  }
}
