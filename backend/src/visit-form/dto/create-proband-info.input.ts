import { Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { UuidScalar } from "@app/graphql/scalars/uuid-scalar";
import { ProbandInfoEntity } from "@app/visit-form/entities/proband-info.entity";

@InputType()
export class CreateProbandInfoInput extends IntersectionType(
  PickType(ProbandInfoEntity, [
    "name",
    "surname",
    "personalId",
    "birthdate",
    "heightCm",
    "weightKg",
    "visualCorrectionDioptre",
  ]),
  PartialType(PickType(ProbandInfoEntity, ["email", "phone"])),
  InputType
) {
  @Field(() => UuidScalar)
  genderId: string;

  @Field(() => UuidScalar)
  nativeLanguageId: string;

  @Field(() => UuidScalar)
  handednessId: string;
}
