import { Args, Query, Resolver } from "@nestjs/graphql";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { CreateNativeLanguageInput } from "./dto/create-native-language.input";
import { UpdateNativeLanguageInput } from "./dto/update-native-language.input";
import { NativeLanguageEntity } from "./entities/native-language.entity";
import { NativeLanguageService } from "./native-language.service";

@Resolver(() => NativeLanguageEntity)
export class NativeLanguageResolver {
  constructor(private readonly nativeLanguageService: NativeLanguageService) {}

  // @Mutation(() => NativeLanguageEntity)
  async createNativeLanguage(@Args("createNativeLanguageInput") createNativeLanguageInput: CreateNativeLanguageInput) {
    return this.nativeLanguageService.create(createNativeLanguageInput);
  }

  @Query(() => [NativeLanguageEntity], { name: "nativeLanguages" })
  async getNativeLanguages() {
    return this.nativeLanguageService.findAll();
  }

  @Query(() => NativeLanguageEntity, { name: "nativeLanguage" })
  async getNativeLanguage(@Args("code") code: string) {
    return this.nativeLanguageService.findOne(code);
  }

  // @Mutation(() => NativeLanguageEntity)
  async updateNativeLanguage(@Args("updateNativeLanguageInput") updateNativeLanguageInput: UpdateNativeLanguageInput) {
    return this.nativeLanguageService.update(updateNativeLanguageInput.id, updateNativeLanguageInput);
  }

  // @Mutation(() => NativeLanguageEntity)
  async removeNativeLanguage(@Args("id", { type: () => UUID }) id: string) {
    return this.nativeLanguageService.remove(id);
  }
}
