import { Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { CreateAdditionalVisitFormInfoInput } from "@app/api/visit-form/dto/create-additional-visit-form-info.input";
import { CreateAnswerInput } from "@app/api/visit-form/dto/create-answer.input";
import { VisitFormEntity } from "../entities/visit-form.entity";

@InputType()
export class CreateVisitFormInput extends IntersectionType(
  PickType(VisitFormEntity, [
    "name",
    "surname",
    "personalId",
    "birthdate",
    "heightCm",
    "weightKg",
    "visualCorrectionDioptre",
  ]),
  // state is IN_APPROVAL for a duplicated visit that is going to be approved
  PartialType(PickType(VisitFormEntity, ["state", "email", "phone"])),
  InputType
) {
  @Field()
  probandLanguageCode: string;

  @Field(() => [CreateAnswerInput])
  answers: CreateAnswerInput[];

  // additionalInfo is created for a duplicated visit that is going to be approved
  @Field(() => CreateAdditionalVisitFormInfoInput, { nullable: true })
  additionalInfo?: CreateAdditionalVisitFormInfoInput;

  @Field(() => UUID)
  genderId: string;

  @Field(() => UUID)
  nativeLanguageId: string;

  @Field(() => UUID)
  handednessId: string;
}
