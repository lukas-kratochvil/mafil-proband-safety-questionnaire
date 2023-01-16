import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UuidScalar } from "@graphql/scalars/uuid-scalar";
import { CreateNativeLanguageInput } from "./dto/create-native-language.input";
import { UpdateNativeLanguageInput } from "./dto/update-native-language.input";
import { NativeLanguageEntity } from "./entities/native-language.entity";
import { NativeLanguageService } from "./native-language.service";

@Resolver(() => NativeLanguageEntity)
export class NativeLanguageResolver {
  constructor(private readonly nativeLanguageService: NativeLanguageService) {}

  @Mutation(() => NativeLanguageEntity)
  createNativeLanguage(
    @Args("createNativeLanguageInput") createNativeLanguageInput: CreateNativeLanguageInput
  ): Promise<NativeLanguageEntity> {
    return this.nativeLanguageService.create(createNativeLanguageInput);
  }

  @Query(() => [NativeLanguageEntity], { name: "nativeLanguages" })
  findAll(): Promise<NativeLanguageEntity[]> {
    return this.nativeLanguageService.findAll();
  }

  @Query(() => NativeLanguageEntity, { name: "nativeLanguage" })
  findOne(@Args("id", { type: () => UuidScalar }) id: string): Promise<NativeLanguageEntity> {
    return this.nativeLanguageService.findOne(id);
  }

  @Mutation(() => NativeLanguageEntity)
  updateNativeLanguage(
    @Args("updateNativeLanguageInput") updateNativeLanguageInput: UpdateNativeLanguageInput
  ): Promise<NativeLanguageEntity> {
    return this.nativeLanguageService.update(updateNativeLanguageInput.id, updateNativeLanguageInput);
  }

  @Mutation(() => NativeLanguageEntity)
  removeNativeLanguage(@Args("id", { type: () => UuidScalar }) id: string): Promise<NativeLanguageEntity> {
    return this.nativeLanguageService.remove(id);
  }
}
