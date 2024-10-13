import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { LanguageService } from "@app/api/language/language.service";
import { areTranslationsComplete, areUpdateCodesValid, translationsSelect } from "@app/api/utils/utils";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateGenderInput } from "./dto/create-gender.input";
import { UpdateGenderInput } from "./dto/update-gender.input";

const genderInclude = { translations: translationsSelect } as const satisfies Prisma.GenderInclude;

@Injectable()
export class GenderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languageService: LanguageService
  ) {}

  async create(createGenderInput: CreateGenderInput) {
    const languages = await this.languageService.findAll();

    if (!areTranslationsComplete(languages, createGenderInput.translations)) {
      throw new BadRequestException("Gender doesn't contain all the possible translations!");
    }

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
      include: genderInclude,
    });
  }

  async findAll() {
    return this.prisma.gender.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        order: "asc",
      },
      include: genderInclude,
    });
  }

  async findOne(code: string) {
    return this.prisma.gender.findUniqueOrThrow({
      where: {
        code,
      },
      include: genderInclude,
    });
  }

  async update(id: string, updateGenderInput: UpdateGenderInput) {
    const languages = await this.languageService.findAll();

    if (!areUpdateCodesValid(languages, updateGenderInput.translations)) {
      throw new BadRequestException("Gender contains invalid locales!");
    }

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
      include: genderInclude,
    });
  }

  async remove(id: string) {
    return this.prisma.gender.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: genderInclude,
    });
  }
}
