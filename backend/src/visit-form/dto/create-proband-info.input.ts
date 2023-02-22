import { InputType, PickType } from "@nestjs/graphql";
import { ProbandInfoEntity } from "@app/visit-form/entities/proband-info.entity";

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
    "handednessId",
    "email",
    "phone",
  ],
  InputType
) {}
