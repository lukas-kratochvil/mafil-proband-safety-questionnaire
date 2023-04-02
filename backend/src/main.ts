import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createWinstonLogger } from "./log/winston-logger";

async function bootstrap() {
  const logger = createWinstonLogger();
  const app = await NestFactory.create(AppModule, { logger });
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT");

  if (port === undefined) {
    logger.error("MAFIL-PSQ server port is not defined! Shutting down…");
    throw new Error("MAFIL-PSQ server port is not defined! Shutting down…");
  }

  logger.log(`MAFIL-PSQ server is listening on: http://localhost:${port}`);
  await app.listen(port);
}

bootstrap();
