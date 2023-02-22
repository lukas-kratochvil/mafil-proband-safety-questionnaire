import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { LanguageService } from "@app/language/language.service";
import { PrismaService } from "@app/prisma/prisma.service";
import { areTranslationsComplete, areUpdateCodesValid } from "@app/utils/utils";
import { CreateHandednessInput } from "./dto/create-handedness.input";
import { UpdateHandednessInput } from "./dto/update-handedness.input";

const handednessTranslations = Prisma.validator<Prisma.HandednessInclude>()({
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

const handednessIncludingTranslations = Prisma.validator<Prisma.HandednessArgs>()({
  include: handednessTranslations,
});

type HandednessIncludingTranslations = Prisma.HandednessGetPayload<typeof handednessIncludingTranslations>;

@Injectable()
export class HandednessService {
  constructor(private readonly prisma: PrismaService, private readonly languageService: LanguageService) {}

  async create(createHandednessInput: CreateHandednessInput): Promise<HandednessIncludingTranslations> {
    const languages = await this.languageService.findAll();

    if (areTranslationsComplete(languages, createHandednessInput.translations)) {
      return this.prisma.handedness.create({
        data: {
          ...createHandednessInput,
          translations: {
            createMany: {
              data: createHandednessInput.translations.map((translation) => ({
                languageId: languages.find((language) => language.code === translation.code)?.id as string,
                text: translation.text,
              })),
            },
          },
        },
        include: handednessTranslations,
      });
    }

    throw new Error("Handedness doesn't contain all the possible translations!");
  }

  async findAll(): Promise<HandednessIncludingTranslations[]> {
    return this.prisma.handedness.findMany({
      where: {
        deletedAt: null,
      },
      include: handednessTranslations,
    });
  }

  async findOne(id: string): Promise<HandednessIncludingTranslations> {
    return this.prisma.handedness.findUniqueOrThrow({
      where: {
        id,
      },
      include: handednessTranslations,
    });
  }

  async update(id: string, updateHandednessInput: UpdateHandednessInput): Promise<HandednessIncludingTranslations> {
    const languages = await this.languageService.findAll();

    if (areUpdateCodesValid(languages, updateHandednessInput.translations)) {
      return this.prisma.gender.update({
        where: {
          id,
        },
        data: {
          ...updateHandednessInput,
          translations:
            updateHandednessInput.translations === undefined
              ? undefined
              : {
                  updateMany: {
                    where: {
                      genderId: id,
                    },
                    data: updateHandednessInput.translations.map((translation) => ({
                      languageId: languages.find((language) => language.code === translation.code)?.id as string,
                      text: translation.text,
                    })),
                  },
                },
        },
        include: handednessTranslations,
      });
    }

    throw new Error("Handedness doesn't contain all the possible translations!");
  }

  async remove(id: string): Promise<HandednessIncludingTranslations> {
    return this.prisma.handedness.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: handednessTranslations,
    });
  }
}
