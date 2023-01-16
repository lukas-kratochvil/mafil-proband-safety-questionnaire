import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { LanguageService } from "@language/language.service";
import { PrismaService } from "@prisma/prisma.service";
import { areTranslationsComplete, areUpdateCodesValid } from "@utils/utils";
import { CreateGenderInput } from "./dto/create-gender.input";
import { UpdateGenderInput } from "./dto/update-gender.input";

const genderTranslations = Prisma.validator<Prisma.GenderInclude>()({
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

const genderIncludingTranslations = Prisma.validator<Prisma.GenderArgs>()({
  include: genderTranslations,
});

type GenderIncludingTranslations = Prisma.GenderGetPayload<typeof genderIncludingTranslations>;

@Injectable()
export class GenderService {
  constructor(private readonly prisma: PrismaService, private readonly languageService: LanguageService) {}

  async create(createGenderInput: CreateGenderInput): Promise<GenderIncludingTranslations> {
    const languages = await this.languageService.findAll();

    if (areTranslationsComplete(languages, createGenderInput.translations)) {
      return this.prisma.gender.create({
        data: {
          ...createGenderInput,
          translations: {
            createMany: {
              data: createGenderInput.translations.map((translation) => ({
                languageId: languages.find((language) => language.code === translation.code)?.id as string,
                text: translation.text,
              })),
            },
          },
        },
        include: genderTranslations,
      });
    }

    throw new Error("Gender doesn't contain all the possible translations!");
  }

  async findAll(): Promise<GenderIncludingTranslations[]> {
    return this.prisma.gender.findMany({
      where: {
        deletedAt: null,
      },
      include: genderTranslations,
    });
  }

  async findOne(id: string): Promise<GenderIncludingTranslations> {
    return this.prisma.gender.findUniqueOrThrow({
      where: {
        id,
      },
      include: genderTranslations,
    });
  }

  async update(id: string, updateGenderInput: UpdateGenderInput): Promise<GenderIncludingTranslations> {
    const languages = await this.languageService.findAll();

    if (areUpdateCodesValid(languages, updateGenderInput.translations)) {
      return this.prisma.gender.update({
        where: {
          id,
        },
        data: {
          ...updateGenderInput,
          translations:
            updateGenderInput.translations === undefined
              ? undefined
              : {
                  updateMany: {
                    where: {
                      genderId: id,
                    },
                    data: updateGenderInput.translations.map((translation) => ({
                      languageId: languages.find((language) => language.code === translation.code)?.id as string,
                      text: translation.text,
                    })),
                  },
                },
        },
        include: genderTranslations,
      });
    }

    throw new Error("Gender doesn't contain all the possible translations!");
  }

  async remove(id: string): Promise<GenderIncludingTranslations> {
    return this.prisma.gender.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: genderTranslations,
    });
  }
}