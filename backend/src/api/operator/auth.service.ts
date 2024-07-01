import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import type { Operator, Prisma } from "@prisma/client";
import { AUTH_PRISMA_SERVICE } from "@app/constants";
import type { PrismaService } from "@app/prisma/prisma.service";

const getChangedAttrStr = (
  attrName: keyof Operator,
  operator: Operator,
  updatedOperatorData: Prisma.OperatorUpdateInput
) => `${attrName} ('${operator[attrName]}' -> '${updatedOperatorData[attrName]}')`;

const getOperatorChangedDataStr = (operator: Operator, updatedOperatorData: Prisma.OperatorUpdateInput) => {
  const changedData = [];

  if (updatedOperatorData.name && operator.name !== updatedOperatorData.name) {
    changedData.push(getChangedAttrStr("name", operator, updatedOperatorData));
  }
  if (updatedOperatorData.surname && operator.surname !== updatedOperatorData.surname) {
    changedData.push(getChangedAttrStr("surname", operator, updatedOperatorData));
  }
  if (updatedOperatorData.email && operator.email !== updatedOperatorData.email) {
    changedData.push(getChangedAttrStr("email", operator, updatedOperatorData));
  }

  return changedData.join(", ");
};

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_PRISMA_SERVICE) private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(AuthService.name);

  async authenticate(name: string, surname: string, username: string, email: string): Promise<Operator | never> {
    let operator: Operator;

    try {
      operator = await this.prisma.operator.findUniqueOrThrow({
        where: {
          username,
        },
      });
    } catch (e) {
      this.logger.error(`Operator "${username}" is unknown!`);
      throw e;
    }

    if (!operator.isValid) {
      this.logger.error(`Operator "${operator.username}" is invalid!`);
      throw new UnauthorizedException("Operator is invalid!");
    }

    this.logger.log(`Operator "${operator.username}" authenticated.`);
    operator = await this.prisma.operator.update({
      where: {
        id: operator.id,
      },
      data: {
        lastLoggedAt: new Date(),
      },
    });

    // Update operator data if changed
    const updatedOperatorData: Prisma.OperatorUpdateInput = {};

    if (name !== operator.name) {
      updatedOperatorData.name = name;
    }
    if (surname !== operator.surname) {
      updatedOperatorData.surname = surname;
    }
    if (email !== operator.email) {
      updatedOperatorData.email = email;
    }

    // Check if any operator data needs updating. If not, return operator, else update operator properties.
    if (Object.keys(updatedOperatorData).length == 0) {
      return operator;
    }

    const operatorChangedData = getOperatorChangedDataStr(operator, updatedOperatorData);
    this.logger.error(`Operator "${operator.username}" data changed: ${operatorChangedData}!`);
    return this.prisma.operator.update({
      where: {
        username,
      },
      data: updatedOperatorData,
    });
  }

  async verify(username: string): Promise<Operator> {
    return this.prisma.operator.findUniqueOrThrow({
      where: {
        username,
      },
    });
  }
}
