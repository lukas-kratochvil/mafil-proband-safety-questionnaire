import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { LanguageService } from "@app/api/language/language.service";
import { areTranslationsComplete, areUpdateCodesValid, translationsSelect } from "@app/api/utils/utils";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateHandednessInput } from "./dto/create-handedness.input";
import { UpdateHandednessInput } from "./dto/update-handedness.input";

const handednessInclude = { translations: translationsSelect } satisfies Prisma.HandednessInclude;

@Injectable()
export class HandednessService {
  constructor(private readonly prisma: PrismaService, private readonly languageService: LanguageService) {}

  async create(createHandednessInput: CreateHandednessInput) {
    const languages = await this.languageService.findAll();

    if (!areTranslationsComplete(languages, createHandednessInput.translations)) {
      throw new BadRequestException("Handedness doesn't contain all the possible translations!");
    }

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
      include: handednessInclude,
    });
  }

  async findAll() {
    return this.prisma.handedness.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        order: "asc",
      },
      include: handednessInclude,
    });
  }

  async findOne(code: string) {
    return this.prisma.handedness.findUniqueOrThrow({
      where: {
        code,
      },
      include: handednessInclude,
    });
  }

  async update(id: string, updateHandednessInput: UpdateHandednessInput) {
    const languages = await this.languageService.findAll();

    if (!areUpdateCodesValid(languages, updateHandednessInput.translations)) {
      throw new BadRequestException("Handedness contains invalid locales!");
    }

    return this.prisma.handedness.update({
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
                    handednessId: id,
                  },
                  data: updateHandednessInput.translations.map((translation) => ({
                    languageId: languages.find((language) => language.code === translation.code)?.id as string,
                    text: translation.text,
                  })),
                },
              },
      },
      include: handednessInclude,
    });
  }

  async remove(id: string) {
    return this.prisma.handedness.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: handednessInclude,
    });
  }
}
