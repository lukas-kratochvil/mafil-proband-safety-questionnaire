import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateQuestionTranslationInput } from "./dto/create-question-translation.input";
import { UpdateQuestionTranslationInput } from "./dto/update-question-translation.input";
import { QuestionTranslationEntity } from "./entities/question-translation.entity";
import { QuestionTranslationService } from "./question-translation.service";

@Resolver(() => QuestionTranslationEntity)
export class QuestionTranslationResolver {
  constructor(private readonly questionTranslationService: QuestionTranslationService) {}

  @Mutation(() => QuestionTranslationEntity)
  async createQuestionTranslation(
    @Args("createQuestionTranslationInput") createQuestionTranslationInput: CreateQuestionTranslationInput
  ) {
    return this.questionTranslationService.create(createQuestionTranslationInput);
  }

  @Mutation(() => QuestionTranslationEntity)
  async updateQuestionTranslation(
    @Args("updateQuestionTranslationInput") updateQuestionTranslationInput: UpdateQuestionTranslationInput
  ) {
    return this.questionTranslationService.update(updateQuestionTranslationInput.id, updateQuestionTranslationInput);
  }
}
