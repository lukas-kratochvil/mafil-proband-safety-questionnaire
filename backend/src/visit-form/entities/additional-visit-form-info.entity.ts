import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { AdditionalVisitFormInfo } from "@prisma/client";
import { BaseEntity } from "@graphql/base.entity";
import { UuidScalar } from "@graphql/uuid-scalar";
import { OperatorEntity } from "@operator/entities/operator.entity";
import { VisitFormEntity } from "./visit-form.entity";

@ObjectType()
export class AdditionalVisitFormInfoEntity extends BaseEntity implements AdditionalVisitFormInfo {
  @Field(() => VisitFormEntity)
  visitForm: VisitFormEntity;

  @HideField()
  visitFormId: string;

  @Field(() => OperatorEntity)
  finalizer: OperatorEntity;

  @Field(() => UuidScalar)
  finalizerId: string;

  @Field(() => OperatorEntity, { nullable: true })
  approver: OperatorEntity | null;

  @Field(() => UuidScalar, { nullable: true })
  approverId: string | null;

  @Field()
  projectId: string;

  @Field()
  projectAcronym: string;

  @Field()
  deviceId: string;

  @Field()
  deviceName: string;

  @Field()
  isPhantom: boolean;

  @Field(() => Date)
  measuredAt: Date;

  @Field(() => Date)
  finalizedAt: Date;

  @Field(() => Date, { nullable: true })
  approvedAt: Date | null;
}
