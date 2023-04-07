import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet, { HelmetOptions } from "helmet";
import { AppModule } from "./app.module";
import { createUserInputError } from "./exception-handling";
import { createWinstonLogger } from "./winston-logger";

async function bootstrap() {
  const logger = createWinstonLogger();
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger,
  });
  const configService = app.get(ConfigService);

  // Registering plugins
  const devHelmetOptions: HelmetOptions = {
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        "img-src": ["'self'", "data:", "https://cdn.jsdelivr.net"],
      },
    },
  };
  app.use(helmet(configService.get<string>("NODE_ENV") === "development" ? devHelmetOptions : undefined));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: createUserInputError,
      forbidUnknownValues: true,
    })
  );

  // TODO: use CORS? Origins 'localhost' and '127.0.0.1' are different.
  // CORS
  // const webUrl = configService.get<string>("WEB_URL");
  // if (webUrl === undefined) {
  //   const errorMsg = "MAFIL-PSQ web app URL is not defined! Shutting down…";
  //   logger.error(errorMsg);
  //   throw new Error(errorMsg);
  // }
  // app.enableCors({ origin: [webUrl] });

  // Setting up the port
  const port = configService.get<number>("PORT");

  if (port === undefined) {
    const errorMsg = "MAFIL-PSQ server port is not defined! Shutting down…";
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Starting the app
  logger.log(`MAFIL-PSQ server is listening on: http://localhost:${port}`);
  await app.listen(port);
}

bootstrap();
