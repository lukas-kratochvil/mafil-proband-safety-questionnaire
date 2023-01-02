import { InputType, OmitType } from "@nestjs/graphql";
import { ProbandInfoEntity } from "@visit-form/entities/proband-info.entity";

@InputType()
export class CreateProbandInfoInput extends OmitType(ProbandInfoEntity, ["id", "createdAt", "visitForms"], InputType) {}
