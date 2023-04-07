import { Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { IsArray, IsInstance, IsOptional, IsUUID, MaxLength } from "class-validator";
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
  ] as const),
  // state is IN_APPROVAL for a duplicated visit that is going to be approved
  PartialType(PickType(VisitFormEntity, ["state", "email", "phone"] as const)),
  InputType
) {
  @Field()
  @MaxLength(5)
  probandLanguageCode: string;

  @Field(() => [CreateAnswerInput])
  @IsArray()
  answers: CreateAnswerInput[];

  // additionalInfo is created for a duplicated visit that is going to be approved
  @Field(() => CreateAdditionalVisitFormInfoInput, { nullable: true })
  @IsOptional()
  @IsInstance(CreateAdditionalVisitFormInfoInput)
  additionalInfo?: CreateAdditionalVisitFormInfoInput;

  @Field(() => UUID)
  @IsUUID()
  genderId: string;

  @Field(() => UUID)
  @IsUUID()
  nativeLanguageId: string;

  @Field(() => UUID)
  @IsUUID()
  handednessId: string;
}
