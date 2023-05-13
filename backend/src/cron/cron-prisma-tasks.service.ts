import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { VisitFormState } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class CronPrismaTasksService {
  private readonly logger = new Logger(CronPrismaTasksService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async deleteDeletedVisitForms() {
    const sameTimeYesterday = new Date(Date.now() - MILLISECONDS_IN_DAY).toISOString();
    const deletedState = VisitFormState.DELETED;

    const { count } = await this.prisma.visitForm.deleteMany({
      where: {
        AND: [
          {
            deletedAt: {
              lte: sameTimeYesterday,
            },
          },
          {
            state: deletedState,
          },
        ],
      },
    });

    if (count > 0) {
      const isSingle = count === 1;
      this.logger.log(
        `Deleted ${count} visit form${isSingle ? "" : "s"} that ${
          isSingle ? "was" : "were"
        } marked as ${deletedState} before ${sameTimeYesterday}.`
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async deletePdfGeneratedVisitForms() {
    const sameTimeYesterday = new Date(Date.now() - MILLISECONDS_IN_DAY).toISOString();
    const pdfGeneratedState = VisitFormState.PDF_GENERATED;

    const { count } = await this.prisma.visitForm.deleteMany({
      where: {
        AND: [
          {
            deletedAt: {
              lte: sameTimeYesterday,
            },
          },
          {
            state: pdfGeneratedState,
          },
        ],
      },
    });

    if (count > 0) {
      const isSingle = count === 1;
      this.logger.log(
        `Deleted ${count} visit form${isSingle ? "" : "s"} that ${
          isSingle ? "was" : "were"
        } marked as ${pdfGeneratedState} before ${sameTimeYesterday}.`
      );
    }
  }
}
