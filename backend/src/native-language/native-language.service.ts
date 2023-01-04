import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { LanguageService } from "@language/language.service";
import { PrismaService } from "@prisma/prisma.service";
import { areCodesValid, areTranslationsComplete } from "@utils/utils";
import { CreateNativeLanguageInput } from "./dto/create-native-language.input";
import { UpdateNativeLanguageTextsInput } from "./dto/update-native-language-texts.input";
import { UpdateNativeLanguageInput } from "./dto/update-native-language.input";

const nativeLanguageTranslations = Prisma.validator<Prisma.NativeLanguageInclude>()({
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

const nativeLanguageIncludingTranslations = Prisma.validator<Prisma.NativeLanguageArgs>()({
  include: nativeLanguageTranslations,
});
type NativeLanguageIncludingTranslations = Prisma.NativeLanguageGetPayload<typeof nativeLanguageIncludingTranslations>;

@Injectable()
export class NativeLanguageService {
  constructor(private readonly prisma: PrismaService, private readonly languageService: LanguageService) {}

  async create(createNativeLanguageInput: CreateNativeLanguageInput): Promise<NativeLanguageIncludingTranslations> {
    const languages = await this.languageService.findAll();

    if (areTranslationsComplete(languages, createNativeLanguageInput.translations)) {
      return this.prisma.nativeLanguage.create({
        data: {
          ...createNativeLanguageInput,
          translations: {
            createMany: {
              data: createNativeLanguageInput.translations.map((translation) => ({
                languageId: languages.find((language) => language.code === translation.code)?.id as string,
                text: translation.text,
              })),
            },
          },
        },
        include: nativeLanguageTranslations,
      });
    }

    throw new Error("Native language doesn't contain all the possible translations!");
  }

  async findAll(): Promise<NativeLanguageIncludingTranslations[]> {
    return this.prisma.nativeLanguage.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        order: "asc",
      },
      include: nativeLanguageTranslations,
    });
  }

  async findOne(id: string): Promise<NativeLanguageIncludingTranslations> {
    return this.prisma.nativeLanguage.findUniqueOrThrow({
      where: {
        id,
      },
      include: nativeLanguageTranslations,
    });
  }

  async update(
    id: string,
    updateNativeLanguageInput: UpdateNativeLanguageInput
  ): Promise<NativeLanguageIncludingTranslations> {
    return this.prisma.nativeLanguage.update({
      where: {
        id,
      },
      data: updateNativeLanguageInput,
      include: nativeLanguageTranslations,
    });
  }

  async updateTexts(
    id: string,
    updateNativeLanguageTextsInput: UpdateNativeLanguageTextsInput
  ): Promise<NativeLanguageIncludingTranslations> {
    const languages = await this.languageService.findAll();
    if (areCodesValid(languages, updateNativeLanguageTextsInput.translations)) {
      return this.prisma.nativeLanguage.update({
        where: {
          id,
        },
        data: {
          ...updateNativeLanguageTextsInput,
          translations: {
            updateMany: {
              where: {
                nativeLanguageId: id,
              },
              data: updateNativeLanguageTextsInput.translations.map((translation) => ({
                languageId: languages.find((language) => language.code === translation.code)?.id as string,
                text: translation.text,
              })),
            },
          },
        },
        include: nativeLanguageTranslations,
      });
    }

    throw new Error("Native language invalid contains invalid locales!");
  }

  async remove(id: string): Promise<NativeLanguageIncludingTranslations> {
    return this.prisma.nativeLanguage.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: nativeLanguageTranslations,
    });
  }
}
