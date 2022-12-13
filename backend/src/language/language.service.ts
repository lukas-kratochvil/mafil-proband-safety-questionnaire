import { Injectable } from "@nestjs/common";
import { Language } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { CreateLanguageInput } from "./dto/create-language.input";
import { UpdateLanguageInput } from "./dto/update-language.input";

@Injectable()
export class LanguageService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createLanguageInput: CreateLanguageInput): Promise<Language> {
    return this.prismaService.language.create({
      data: createLanguageInput,
    });
  }

  async findAll(): Promise<Language[]> {
    return this.prismaService.language.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: string): Promise<Language> {
    return this.prismaService.language.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateLanguageInput: UpdateLanguageInput): Promise<Language> {
    return this.prismaService.language.update({
      data: updateLanguageInput,
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<Language> {
    return this.prismaService.language.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }
}
