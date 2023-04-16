import { Args, Query, Resolver } from "@nestjs/graphql";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { CreateQuestionInput } from "./dto/create-question.input";
import { UpdateQuestionTextsInput } from "./dto/update-question-texts.input";
import { UpdateQuestionInput } from "./dto/update-question.input";
import { QuestionEntity } from "./entities/question.entity";
import { QuestionService } from "./question.service";

@Resolver(() => QuestionEntity)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  // @Mutation(() => QuestionEntity)
  createQuestion(@Args("createQuestionInput") createQuestionInput: CreateQuestionInput): Promise<QuestionEntity> {
    return this.questionService.create(createQuestionInput);
  }

  @Query(() => [QuestionEntity], { name: "questions" })
  findAll(): Promise<QuestionEntity[]> {
    return this.questionService.findAll();
  }

  @Query(() => QuestionEntity, { name: "question" })
  findOne(@Args("id", { type: () => UUID }) id: string): Promise<QuestionEntity> {
    return this.questionService.findOne(id);
  }

  // @Mutation(() => QuestionEntity)
  updateQuestion(@Args("updateQuestionInput") updateQuestionInput: UpdateQuestionInput): Promise<QuestionEntity> {
    return this.questionService.update(updateQuestionInput.id, updateQuestionInput);
  }

  // @Mutation(() => QuestionEntity)
  updateQuestionTexts(
    @Args("updateQuestionTextsInput") updateQuestionTextsInput: UpdateQuestionTextsInput
  ): Promise<QuestionEntity> {
    return this.questionService.updateTexts(updateQuestionTextsInput.id, updateQuestionTextsInput);
  }

  // @Mutation(() => QuestionEntity)
  removeQuestion(@Args("id", { type: () => UUID }) id: string): Promise<QuestionEntity> {
    return this.questionService.remove(id);
  }
}
