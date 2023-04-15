import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { CreateLanguageInput } from "./dto/create-language.input";
import { UpdateLanguageInput } from "./dto/update-language.input";
import { LanguageEntity } from "./entities/language.entity";
import { LanguageService } from "./language.service";

@Resolver(() => LanguageEntity)
export class LanguageResolver {
  constructor(private readonly languageService: LanguageService) {}

  // @Mutation(() => LanguageEntity)
  createLanguage(@Args("createLanguageInput") createLanguageInput: CreateLanguageInput): Promise<LanguageEntity> {
    return this.languageService.create(createLanguageInput);
  }

  @Query(() => [LanguageEntity], { name: "languages" })
  findAll(): Promise<LanguageEntity[]> {
    return this.languageService.findAll();
  }

  @Query(() => LanguageEntity, { name: "language" })
  findOne(@Args("id", { type: () => UUID }) id: string): Promise<LanguageEntity> {
    return this.languageService.findOne(id);
  }

  // @Mutation(() => LanguageEntity)
  updateLanguage(@Args("updateLanguageInput") updateLanguageInput: UpdateLanguageInput): Promise<LanguageEntity> {
    return this.languageService.update(updateLanguageInput.id, updateLanguageInput);
  }

  // @Mutation(() => LanguageEntity)
  removeLanguage(@Args("id", { type: () => UUID }) id: string): Promise<LanguageEntity> {
    return this.languageService.remove(id);
  }
}
