import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { LanguageService } from "@app/api/language/language.service";
import { areTranslationsComplete, areUpdateCodesValid, translationsIncludeSchema } from "@app/api/utils/utils";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateNativeLanguageInput } from "./dto/create-native-language.input";
import { UpdateNativeLanguageInput } from "./dto/update-native-language.input";

const nativeLanguageTranslations = Prisma.validator<Prisma.NativeLanguageInclude>()(translationsIncludeSchema);

const nativeLanguageTranslationsArgs = Prisma.validator<Prisma.NativeLanguageArgs>()({
  include: nativeLanguageTranslations,
});

type NativeLanguageIncludingTranslations = Prisma.NativeLanguageGetPayload<typeof nativeLanguageTranslationsArgs>;

@Injectable()
export class NativeLanguageService {
  constructor(private readonly prisma: PrismaService, private readonly languageService: LanguageService) {}

  async create(
    createNativeLanguageInput: CreateNativeLanguageInput
  ): Promise<NativeLanguageIncludingTranslations | never> {
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

    throw new BadRequestException("Native language doesn't contain all the possible translations!");
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

  async findOne(code: string): Promise<NativeLanguageIncludingTranslations> {
    return this.prisma.nativeLanguage.findUniqueOrThrow({
      where: {
        code,
      },
      include: nativeLanguageTranslations,
    });
  }

  async update(
    id: string,
    updateNativeLanguageInput: UpdateNativeLanguageInput
  ): Promise<NativeLanguageIncludingTranslations | never> {
    const languages = await this.languageService.findAll();

    if (areUpdateCodesValid(languages, updateNativeLanguageInput.translations)) {
      return this.prisma.nativeLanguage.update({
        where: {
          id,
        },
        data: {
          ...updateNativeLanguageInput,
          translations:
            updateNativeLanguageInput.translations === undefined
              ? undefined
              : {
                  updateMany: {
                    where: {
                      nativeLanguageId: id,
                    },
                    data: updateNativeLanguageInput.translations.map((translation) => ({
                      languageId: languages.find((language) => language.code === translation.code)?.id as string,
                      text: translation.text,
                    })),
                  },
                },
        },
        include: nativeLanguageTranslations,
      });
    }

    throw new BadRequestException("Native language contains invalid locales!");
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
