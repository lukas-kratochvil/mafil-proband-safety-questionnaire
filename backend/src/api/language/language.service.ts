import { Injectable } from "@nestjs/common";
import { Language } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateLanguageInput } from "./dto/create-language.input";
import { UpdateLanguageInput } from "./dto/update-language.input";

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLanguageInput: CreateLanguageInput): Promise<Language> {
    return this.prisma.language.create({
      data: createLanguageInput,
    });
  }

  async findAll(): Promise<Language[]> {
    return this.prisma.language.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: string): Promise<Language> {
    return this.prisma.language.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateLanguageInput: UpdateLanguageInput): Promise<Language> {
    return this.prisma.language.update({
      data: updateLanguageInput,
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<Language> {
    return this.prisma.language.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }
}
