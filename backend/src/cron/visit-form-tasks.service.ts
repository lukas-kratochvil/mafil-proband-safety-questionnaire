import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { VisitFormState } from "@prisma/client";
import { millisecondsInSecond, secondsInDay } from "date-fns/constants";
import { PrismaService } from "@app/prisma/prisma.service";

const MILLISECONDS_IN_DAY = millisecondsInSecond * secondsInDay;

@Injectable()
export class VisitFormTasksService {
  readonly #logger = new Logger(VisitFormTasksService.name);

  constructor(private readonly prisma: PrismaService) {}

  async #deleteVisitForms (visitFormState: VisitFormState, deleteLowerThanDate: string) {
    const { count } = await this.prisma.visitForm.deleteMany({
      where: {
        AND: [
          {
            deletedAt: {
              lte: deleteLowerThanDate,
            },
          },
          {
            state: visitFormState,
          },
        ],
      },
    });

    if (count === 0) {
      return;
    }

    const isSingle = count === 1;
    this.#logger.log(
      `Deleted ${count} visit form${isSingle ? "" : "s"} that ${
        isSingle ? "was" : "were"
      } marked as '${visitFormState}' before ${deleteLowerThanDate}.`
    );
  };

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async deleteDeletedVisitForms() {
    const sameTimeYesterday = new Date(Date.now() - MILLISECONDS_IN_DAY).toISOString();
    await this.#deleteVisitForms(VisitFormState.DELETED, sameTimeYesterday);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async deletePdfGeneratedVisitForms() {
    const sameTimeYesterday = new Date(Date.now() - MILLISECONDS_IN_DAY).toISOString();
    await this.#deleteVisitForms(VisitFormState.PDF_GENERATED, sameTimeYesterday);
  }
}
