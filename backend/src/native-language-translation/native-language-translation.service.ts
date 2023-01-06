import { Injectable } from "@nestjs/common";
import { NativeLanguageTranslation } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { CreateNativeLanguageTranslationInput } from "./dto/create-native-language-translation.input";
import { UpdateNativeLanguageTranslationInput } from "./dto/update-native-language-translation.input";

@Injectable()
export class NativeLanguageTranslationService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createNativeLanguageTranslationInput: CreateNativeLanguageTranslationInput
  ): Promise<NativeLanguageTranslation> {
    return this.prisma.nativeLanguageTranslation.create({
      data: createNativeLanguageTranslationInput,
    });
  }

  update(id: string, updateNativeLanguageTranslationInput: UpdateNativeLanguageTranslationInput) {
    return this.prisma.nativeLanguageTranslation.update({
      where: {
        id,
      },
      data: updateNativeLanguageTranslationInput,
    });
  }
}
