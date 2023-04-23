import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateNativeLanguageTranslationInput } from "./dto/create-native-language-translation.input";
import { UpdateNativeLanguageTranslationInput } from "./dto/update-native-language-translation.input";
import { NativeLanguageTranslationEntity } from "./entities/native-language-translation.entity";
import { NativeLanguageTranslationService } from "./native-language-translation.service";

@Resolver(() => NativeLanguageTranslationEntity)
export class NativeLanguageTranslationResolver {
  constructor(private readonly nativeLanguageTranslationService: NativeLanguageTranslationService) {}

  @Mutation(() => NativeLanguageTranslationEntity)
  async createNativeLanguageTranslation(
    @Args("createNativeLanguageTranslationInput")
    createNativeLanguageTranslationInput: CreateNativeLanguageTranslationInput
  ) {
    return this.nativeLanguageTranslationService.create(createNativeLanguageTranslationInput);
  }

  @Mutation(() => NativeLanguageTranslationEntity)
  async updateNativeLanguageTranslation(
    @Args("updateNativeLanguageTranslationInput")
    updateNativeLanguageTranslationInput: UpdateNativeLanguageTranslationInput
  ) {
    return this.nativeLanguageTranslationService.update(
      updateNativeLanguageTranslationInput.id,
      updateNativeLanguageTranslationInput
    );
  }
}
