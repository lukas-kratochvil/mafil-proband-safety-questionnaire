import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { LanguageService } from "@app/api/language/language.service";
import { areTranslationsComplete, areUpdateCodesValid, translationsIncludeSchema } from "@app/api/utils/utils";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateHandednessInput } from "./dto/create-handedness.input";
import { UpdateHandednessInput } from "./dto/update-handedness.input";

const handednessTranslations = Prisma.validator<Prisma.HandednessInclude>()(translationsIncludeSchema);

const handednessTranslationsArgs = Prisma.validator<Prisma.HandednessDefaultArgs>()({
  include: handednessTranslations,
});

type HandednessIncludingTranslations = Prisma.HandednessGetPayload<typeof handednessTranslationsArgs>;

@Injectable()
export class HandednessService {
  constructor(private readonly prisma: PrismaService, private readonly languageService: LanguageService) {}

  async create(createHandednessInput: CreateHandednessInput): Promise<HandednessIncludingTranslations | never> {
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

    throw new BadRequestException("Handedness doesn't contain all the possible translations!");
  }

  async findAll(): Promise<HandednessIncludingTranslations[]> {
    return this.prisma.handedness.findMany({
      where: {
        deletedAt: null,
      },
      include: handednessTranslations,
    });
  }

  async findOne(code: string): Promise<HandednessIncludingTranslations> {
    return this.prisma.handedness.findUniqueOrThrow({
      where: {
        code,
      },
      include: handednessTranslations,
    });
  }

  async update(
    id: string,
    updateHandednessInput: UpdateHandednessInput
  ): Promise<HandednessIncludingTranslations | never> {
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

    throw new BadRequestException("Handedness contains invalid locales!");
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
