import { InputType, PickType } from "@nestjs/graphql";
import { ProbandInfoEntity } from "@visit-form/entities/proband-info.entity";

@InputType()
export class CreateProbandInfoInput extends PickType(
  ProbandInfoEntity,
  [
    "name",
    "surname",
    "personalId",
    "birthdate",
    "genderId",
    "nativeLanguageId",
    "heightCm",
    "weightKg",
    "visualCorrectionDioptre",
    "handedness",
    "email",
    "phone",
  ],
  InputType
) {}
