import { Query, Resolver } from "@nestjs/graphql";
import { NativeLanguageEntity } from "./entities/native-language.entity";
import { NativeLanguageService } from "./native-language.service";

@Resolver(() => NativeLanguageEntity)
export class NativeLanguageResolver {
  constructor(private readonly nativeLanguageService: NativeLanguageService) {}

  @Query(() => [NativeLanguageEntity], { name: "nativeLanguages" })
  async getNativeLanguages() {
    return this.nativeLanguageService.findAll();
  }
}
