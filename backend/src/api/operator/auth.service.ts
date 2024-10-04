import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Operator, Prisma } from "@prisma/client";
import type { PrismaService } from "@app/prisma/prisma.service";
import { AUTH_PRISMA_SERVICE } from "./constants";

type ModifiableOperatorData = Pick<Operator, "name" | "surname" | "email">;

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class AuthService {
  constructor(@Inject(AUTH_PRISMA_SERVICE) private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(AuthService.name);

  private getChangedOperatorData(
    operator: Operator,
    modifiableData: ModifiableOperatorData
  ): [Prisma.OperatorUpdateInput, string] {
    const updatedOperatorData: Prisma.OperatorUpdateInput = {};
    const changedData: string[] = [];

    (Object.entries(modifiableData) as [keyof typeof modifiableData, string][]).forEach(([key, value]) => {
      if (value !== operator[key]) {
        updatedOperatorData[key] = value;
        changedData.push(`${key} ('${operator[key]}' -> '${updatedOperatorData[key]}')`);
      }
    });

    return [updatedOperatorData, changedData.join(", ")];
  }

  async authenticate(username: string, operatorInput: ModifiableOperatorData): Promise<Operator | never> {
    // get only those properties which can be changed
    //  - when the spread operator is used to pass 'operatorInput' in the authenticate() function it actually copies all the object properties and not only those in the ModifiableOperatorData type and so the getChangedOperatorData() function won't work as expected and will return changed operator attributes not present in the ModifiableOperatorData type
    const modifiableData: ModifiableOperatorData = {
      name: operatorInput.name,
      surname: operatorInput.surname,
      email: operatorInput.email,
    };
    let operator: Operator;

    try {
      operator = await this.verify(username);
    } catch (e) {
      this.logger.error(`Operator '${username}' is unknown or invalid!`);
      throw e;
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

    // Get changed operator data
    const [changedOperatorData, changedOperatorDataStr] = this.getChangedOperatorData(operator, modifiableData);

    // Check if any operator data needs updating. If not, return operator, else update operator properties.
    if (Object.keys(changedOperatorData).length == 0) {
      return operator;
    }

    this.logger.warn(`Operator '${operator.username}' data changed: ${changedOperatorDataStr}!`);
    return this.prisma.operator.update({
      where: {
        username,
      },
      data: changedOperatorData,
    });
  }

  async verify(username: string): Promise<Operator> {
    return this.prisma.operator.findUniqueOrThrow({
      where: {
        username,
        isValid: true,
      },
    });
  }
}
