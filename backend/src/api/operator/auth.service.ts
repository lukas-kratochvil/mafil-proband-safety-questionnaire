import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import type { Operator, Prisma } from "@prisma/client";
import type { PrismaService } from "@app/prisma/prisma.service";
import { AUTH_PRISMA_SERVICE } from "./constants";

type ModifiableOperatorData = Pick<Operator, "name" | "surname" | "email">;

const getUpdatedOperatorData = (
  operator: Operator,
  modifiableData: ModifiableOperatorData
): [Prisma.OperatorUpdateInput, string] => {
  const updatedOperatorData: Prisma.OperatorUpdateInput = {};
  const changedData: string[] = [];

  (Object.entries(modifiableData) as [keyof typeof modifiableData, string][]).forEach(([key, value]) => {
    if (value !== operator[key]) {
      updatedOperatorData[key] = value;
      changedData.push(`${key} ('${operator[key]}' -> '${updatedOperatorData[key]}')`);
    }
  });

  return [updatedOperatorData, changedData.join(", ")];
};

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class AuthService {
  constructor(@Inject(AUTH_PRISMA_SERVICE) private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(AuthService.name);

  async authenticate(username: string, modifiableData: ModifiableOperatorData): Promise<Operator | never> {
    let operator: Operator;

    try {
      operator = await this.verify(username);
    } catch (e) {
      this.logger.error(`Operator '${username}' is unknown!`);
      throw e;
    }

    if (!operator.isValid) {
      this.logger.error(`Operator '${operator.username}' is invalid!`);
      throw new UnauthorizedException("Operator is invalid!");
    }

    this.logger.log(`Operator '${operator.username}' authenticated.`);
    operator = await this.prisma.operator.update({
      where: {
        username,
      },
      data: {
        lastLoggedAt: new Date(),
      },
    });

    // Update operator data if changed
    const [updatedOperatorData, operatorChangedData] = getUpdatedOperatorData(operator, modifiableData);

    // Check if any operator data needs updating. If not, return operator, else update operator properties.
    if (Object.keys(updatedOperatorData).length == 0) {
      return operator;
    }

    this.logger.warn(`Operator '${operator.username}' data changed: ${operatorChangedData}!`);
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
