import { InputType, PartialType } from "@nestjs/graphql";
import { CreateProbandInfoInput } from "./create-proband-info.input";

@InputType()
export class UpdateProbandInfoInput extends PartialType(CreateProbandInfoInput, InputType) {}
