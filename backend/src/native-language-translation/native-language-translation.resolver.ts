import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateNativeLanguageTranslationInput } from "./dto/create-native-language-translation.input";
import { UpdateNativeLanguageTranslationInput } from "./dto/update-native-language-translation.input";
import { NativeLanguageTranslationEntity } from "./entities/native-language-translation.entity";
import { NativeLanguageTranslationService } from "./native-language-translation.service";

@Resolver(() => NativeLanguageTranslationEntity)
export class NativeLanguageTranslationResolver {
  constructor(private readonly nativeLanguageTranslationService: NativeLanguageTranslationService) {}

  @Mutation(() => NativeLanguageTranslationEntity)
  createNativeLanguageTranslation(
    @Args("createNativeLanguageTranslationInput")
    createNativeLanguageTranslationInput: CreateNativeLanguageTranslationInput
  ): Promise<NativeLanguageTranslationEntity> {
    return this.nativeLanguageTranslationService.create(createNativeLanguageTranslationInput);
  }

  @Mutation(() => NativeLanguageTranslationEntity)
  updateNativeLanguageTranslation(
    @Args("updateNativeLanguageTranslationInput")
    updateNativeLanguageTranslationInput: UpdateNativeLanguageTranslationInput
  ): Promise<NativeLanguageTranslationEntity> {
    return this.nativeLanguageTranslationService.update(
      updateNativeLanguageTranslationInput.id,
      updateNativeLanguageTranslationInput
    );
  }
}
