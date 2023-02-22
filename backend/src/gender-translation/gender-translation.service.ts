import { Injectable } from "@nestjs/common";
import { GenderTranslation } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { CreateGenderTranslationInput } from "./dto/create-gender-translation.input";
import { UpdateGenderTranslationInput } from "./dto/update-gender-translation.input";

@Injectable()
export class GenderTranslationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGenderTranslationInput: CreateGenderTranslationInput): Promise<GenderTranslation> {
    return this.prisma.genderTranslation.create({
      data: createGenderTranslationInput,
    });
  }

  async update(id: string, updateGenderTranslationInput: UpdateGenderTranslationInput): Promise<GenderTranslation> {
    return this.prisma.genderTranslation.update({
      where: {
        id,
      },
      data: updateGenderTranslationInput,
    });
  }
}
