import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateHandednessTranslationInput } from "./dto/create-handedness-translation.input";
import { UpdateHandednessTranslationInput } from "./dto/update-handedness-translation.input";
import { HandednessTranslationEntity } from "./entities/handedness-translation.entity";
import { HandednessTranslationService } from "./handedness-translation.service";

@Resolver(() => HandednessTranslationEntity)
export class HandednessTranslationResolver {
  constructor(private readonly handednessTranslationService: HandednessTranslationService) {}

  @Mutation(() => HandednessTranslationEntity)
  async createHandednessTranslation(
    @Args("createHandednessTranslationInput") createHandednessTranslationInput: CreateHandednessTranslationInput
  ) {
    return this.handednessTranslationService.create(createHandednessTranslationInput);
  }

  @Mutation(() => HandednessTranslationEntity)
  async updateHandednessTranslation(
    @Args("updateHandednessTranslationInput") updateHandednessTranslationInput: UpdateHandednessTranslationInput
  ) {
    return this.handednessTranslationService.update(
      updateHandednessTranslationInput.id,
      updateHandednessTranslationInput
    );
  }
}
