import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient<{
    log: [{ level: "warn"; emit: "event" }, { level: "error"; emit: "event" }];
  }>
  implements OnModuleInit
{
  readonly #logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // Setup logging
    this.$on("warn", (event) => {
      this.#logger.warn(event.message, event.target);
    });
    this.$on("error", (event) => {
      this.#logger.error(event.message, event.target);
    });

    await this.$connect();
  }
}
