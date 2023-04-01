import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { WinstonModule } from "nest-winston";
import { AppModule } from "./app.module";
import { createWinstonLogger } from "./log/winston-logger";

async function bootstrap() {
  const winstonLogger = createWinstonLogger();
  const app = await NestFactory.create(AppModule, { logger: WinstonModule.createLogger(winstonLogger) });
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT");

  if (port === undefined) {
    throw new Error("MAFIL-PSQ server port is not defined! Shutting down…");
  }

  console.log(`MAFIL-PSQ server is listening on: http://localhost:${port}`);
  await app.listen(port);
}

bootstrap();
