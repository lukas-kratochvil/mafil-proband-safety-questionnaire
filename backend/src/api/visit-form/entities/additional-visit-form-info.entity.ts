import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { AdditionalVisitFormInfo } from "@prisma/client";
import { OperatorEntity } from "@app/api/operator/entities/operator.entity";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
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

  @Field()
  measuredAt: Date;

  @Field()
  finalizedAt: Date;
}
