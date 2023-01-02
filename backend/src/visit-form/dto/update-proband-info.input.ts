import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { ProbandInfoEntity } from "@visit-form/entities/proband-info.entity";
import { CreateProbandInfoInput } from "./create-proband-info.input";

@InputType()
export class UpdateProbandInfoInput extends IntersectionType(
  PickType(ProbandInfoEntity, ["id"], InputType),
  PartialType(CreateProbandInfoInput)
) {}
