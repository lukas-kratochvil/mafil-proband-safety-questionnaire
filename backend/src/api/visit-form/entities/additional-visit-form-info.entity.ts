import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";
import { AdditionalVisitFormInfo } from "@prisma/client";
import { IsDate, IsNumber, IsObject, IsPositive, IsUUID, MaxLength } from "class-validator";
import { OperatorEntity } from "@app/api/operator/entities/operator.entity";
import { BaseEntity } from "@app/api/utils/entities/base.entity";
import { UUID } from "@app/api/utils/scalars/uuid-scalar";
import { VisitFormEntity } from "./visit-form.entity";

@ObjectType()
export class AdditionalVisitFormInfoEntity extends BaseEntity implements AdditionalVisitFormInfo {
  @IsObject()
  @HideField()
  visitForm: VisitFormEntity;

  @IsUUID()
  @HideField()
  visitFormId: string;

  @IsObject()
  @Field(() => OperatorEntity)
  finalizer: OperatorEntity;

  @IsUUID()
  @Field(() => UUID)
  finalizerId: string;

  @IsDate()
  @Field()
  finalizedAt: Date;

  @MaxLength(35)
  @Field()
  projectUuid: string;

  @MaxLength(30)
  @Field()
  projectAcronym: string;

  @IsNumber()
  @IsPositive()
  @Field(() => Int)
  deviceId: number;

  @MaxLength(200)
  @Field()
  deviceName: string;

  @IsDate()
  @Field()
  measuredAt: Date;
}
