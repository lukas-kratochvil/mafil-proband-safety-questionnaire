import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createWinstonLogger } from "./log/winston-logger";

async function bootstrap() {
  const logger = createWinstonLogger();
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger,
  });
  const configService = app.get(ConfigService);

  // TODO: use CORS? Origins 'localhost' and '127.0.0.1' are different.
  // CORS
  // const webUrl = configService.get<string>("WEB_URL");
  // if (webUrl === undefined) {
  //   const errorMsg = "MAFIL-PSQ web app URL is not defined! Shutting down…";
  //   logger.error(errorMsg);
  //   throw new Error(errorMsg);
  // }
  // app.enableCors({ origin: [webUrl] });

  // PORT
  const port = configService.get<number>("PORT");
  if (port === undefined) {
    const errorMsg = "MAFIL-PSQ server port is not defined! Shutting down…";
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
  logger.log(`MAFIL-PSQ server is listening on: http://localhost:${port}`);

  // STARTING THE APP
  await app.listen(port);
}

bootstrap();
