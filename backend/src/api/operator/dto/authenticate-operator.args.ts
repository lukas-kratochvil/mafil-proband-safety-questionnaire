import { ArgsType, PickType } from "@nestjs/graphql";
import { OperatorEntity } from "@app/api/operator/entities/operator.entity";

@ArgsType()
export class AuthenticateOperatorArgs extends PickType(OperatorEntity, ["name", "surname", "uco", "email"], ArgsType) {}
