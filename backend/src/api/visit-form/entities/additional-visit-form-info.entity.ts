import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { AdditionalVisitFormInfo } from "@prisma/client";
import { BaseEntity } from "@app/api/graphql/entities/base.entity";
import { UUID } from "@app/api/graphql/scalars/uuid-scalar";
import { OperatorEntity } from "@app/api/operator/entities/operator.entity";
import { VisitFormEntity } from "./visit-form.entity";

@ObjectType()
export class AdditionalVisitFormInfoEntity extends BaseEntity implements AdditionalVisitFormInfo {
  @Field(() => VisitFormEntity)
  visitForm: VisitFormEntity;

  @HideField()
  visitFormId: string;

  @Field(() => OperatorEntity)
  finalizer: OperatorEntity;

  @Field(() => UUID)
  finalizerId: string;

  @Field()
  projectId: string;

  @Field()
  projectAcronym: string;

  @Field()
  deviceId: string;

  @Field()
  deviceName: string;

  @Field(() => Date)
  measuredAt: Date;

  @Field(() => Date)
  finalizedAt: Date;
}
