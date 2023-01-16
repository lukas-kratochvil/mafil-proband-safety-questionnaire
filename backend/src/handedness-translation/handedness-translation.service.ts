import { Injectable } from "@nestjs/common";
import { HandednessTranslation } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { CreateHandednessTranslationInput } from "./dto/create-handedness-translation.input";
import { UpdateHandednessTranslationInput } from "./dto/update-handedness-translation.input";

@Injectable()
export class HandednessTranslationService {
  constructor(private readonly prisma: PrismaService) {}

  create(createHandednessTranslationInput: CreateHandednessTranslationInput): Promise<HandednessTranslation> {
    return this.prisma.handednessTranslation.create({
      data: createHandednessTranslationInput,
    });
  }

  update(
    id: string,
    updateHandednessTranslationInput: UpdateHandednessTranslationInput
  ): Promise<HandednessTranslation> {
    return this.prisma.handednessTranslation.update({
      where: {
        id,
      },
      data: updateHandednessTranslationInput,
    });
  }
}
