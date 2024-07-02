import { Args, Query, Resolver } from "@nestjs/graphql";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { SkipOidcAuth } from "../operator/auth.guard";
import { CreateQuestionInput } from "./dto/create-question.input";
import { UpdateQuestionTextsInput } from "./dto/update-question-texts.input";
import { UpdateQuestionInput } from "./dto/update-question.input";
import { QuestionEntity } from "./entities/question.entity";
import { QuestionService } from "./question.service";

@Resolver(() => QuestionEntity)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  // @Mutation(() => QuestionEntity)
  async createQuestion(@Args("createQuestionInput") createQuestionInput: CreateQuestionInput) {
    return this.questionService.create(createQuestionInput);
  }

  @SkipOidcAuth()
  @Query(() => [QuestionEntity], { name: "questions" })
  async getQuestions() {
    return this.questionService.findAll();
  }

  @Query(() => QuestionEntity, { name: "question" })
  async getQuestion(@Args("id", { type: () => UUID }) id: string) {
    return this.questionService.findOne(id);
  }

  // @Mutation(() => QuestionEntity)
  async updateQuestion(@Args("updateQuestionInput") updateQuestionInput: UpdateQuestionInput) {
    return this.questionService.update(updateQuestionInput.id, updateQuestionInput);
  }

  // @Mutation(() => QuestionEntity)
  async updateQuestionTexts(@Args("updateQuestionTextsInput") updateQuestionTextsInput: UpdateQuestionTextsInput) {
    return this.questionService.updateTexts(updateQuestionTextsInput.id, updateQuestionTextsInput);
  }

  // @Mutation(() => QuestionEntity)
  async removeQuestion(@Args("id", { type: () => UUID }) id: string) {
    return this.questionService.remove(id);
  }
}
