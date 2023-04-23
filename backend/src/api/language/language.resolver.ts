import { Args, Query, Resolver } from "@nestjs/graphql";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { CreateLanguageInput } from "./dto/create-language.input";
import { UpdateLanguageInput } from "./dto/update-language.input";
import { LanguageEntity } from "./entities/language.entity";
import { LanguageService } from "./language.service";

@Resolver(() => LanguageEntity)
export class LanguageResolver {
  constructor(private readonly languageService: LanguageService) {}

  // @Mutation(() => LanguageEntity)
  async createLanguage(@Args("createLanguageInput") createLanguageInput: CreateLanguageInput) {
    return this.languageService.create(createLanguageInput);
  }

  @Query(() => [LanguageEntity], { name: "languages" })
  async getLanguages() {
    return this.languageService.findAll();
  }

  @Query(() => LanguageEntity, { name: "language" })
  async getLanguage(@Args("id", { type: () => UUID }) id: string) {
    return this.languageService.findOne(id);
  }

  // @Mutation(() => LanguageEntity)
  async updateLanguage(@Args("updateLanguageInput") updateLanguageInput: UpdateLanguageInput) {
    return this.languageService.update(updateLanguageInput.id, updateLanguageInput);
  }

  // @Mutation(() => LanguageEntity)
  async removeLanguage(@Args("id", { type: () => UUID }) id: string) {
    return this.languageService.remove(id);
  }
}
