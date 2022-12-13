import { InputType, PickType } from "@nestjs/graphql";
import { QuestionEntity } from "@question/entities/question.entity";

@InputType()
export class CreateQuestionInput extends PickType(QuestionEntity, ["partNumber"], InputType) {}
