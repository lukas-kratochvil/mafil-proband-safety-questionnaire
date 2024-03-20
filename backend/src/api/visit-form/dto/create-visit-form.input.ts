import { Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { ArrayNotEmpty, ArrayUnique, IsArray, IsObject, IsOptional, IsUUID, MaxLength } from "class-validator";
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
    "nativeLanguageCode",
    "heightCm",
    "weightKg",
    "visualCorrectionDioptre",
  ] as const),
  // state is IN_APPROVAL for a duplicated visit that is going to be approved
  PartialType(PickType(VisitFormEntity, ["state", "email", "phone"] as const)),
  InputType
) {
  @MaxLength(5)
  @Field()
  probandLanguageCode: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique<CreateAnswerInput>((elem) => elem.questionId)
  @Field(() => [CreateAnswerInput])
  answers: CreateAnswerInput[];

  // additionalInfo is created for a duplicated visit that is going to be approved
  @IsOptional()
  @IsObject()
  @Field(() => CreateAdditionalVisitFormInfoInput, { nullable: true })
  additionalInfo?: CreateAdditionalVisitFormInfoInput;

  @IsUUID()
  @Field(() => UUID)
  genderId: string;

  @IsUUID()
  @Field(() => UUID)
  handednessId: string;
}
