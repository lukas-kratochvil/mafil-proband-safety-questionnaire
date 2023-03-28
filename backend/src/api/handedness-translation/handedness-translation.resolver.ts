import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateHandednessTranslationInput } from "./dto/create-handedness-translation.input";
import { UpdateHandednessTranslationInput } from "./dto/update-handedness-translation.input";
import { HandednessTranslationEntity } from "./entities/handedness-translation.entity";
import { HandednessTranslationService } from "./handedness-translation.service";

@Resolver(() => HandednessTranslationEntity)
export class HandednessTranslationResolver {
  constructor(private readonly handednessTranslationService: HandednessTranslationService) {}

  @Mutation(() => HandednessTranslationEntity)
  createHandednessTranslation(
    @Args("createHandednessTranslationInput") createHandednessTranslationInput: CreateHandednessTranslationInput
  ): Promise<HandednessTranslationEntity> {
    return this.handednessTranslationService.create(createHandednessTranslationInput);
  }

  @Mutation(() => HandednessTranslationEntity)
  updateHandednessTranslation(
    @Args("updateHandednessTranslationInput") updateHandednessTranslationInput: UpdateHandednessTranslationInput
  ): Promise<HandednessTranslationEntity> {
    return this.handednessTranslationService.update(
      updateHandednessTranslationInput.id,
      updateHandednessTranslationInput
    );
  }
}
