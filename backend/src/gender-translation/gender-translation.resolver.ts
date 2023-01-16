import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { GenderTranslation } from "@prisma/client";
import { CreateGenderTranslationInput } from "./dto/create-gender-translation.input";
import { UpdateGenderTranslationInput } from "./dto/update-gender-translation.input";
import { GenderTranslationEntity } from "./entities/gender-translation.entity";
import { GenderTranslationService } from "./gender-translation.service";

@Resolver(() => GenderTranslationEntity)
export class GenderTranslationResolver {
  constructor(private readonly genderTranslationService: GenderTranslationService) {}

  @Mutation(() => GenderTranslationEntity)
  createGenderTranslation(
    @Args("createGenderTranslationInput") createGenderTranslationInput: CreateGenderTranslationInput
  ): Promise<GenderTranslation> {
    return this.genderTranslationService.create(createGenderTranslationInput);
  }

  @Mutation(() => GenderTranslationEntity)
  updateGenderTranslation(
    @Args("updateGenderTranslationInput") updateGenderTranslationInput: UpdateGenderTranslationInput
  ): Promise<GenderTranslation> {
    return this.genderTranslationService.update(updateGenderTranslationInput.id, updateGenderTranslationInput);
  }
}
