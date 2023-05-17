import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet, { HelmetOptions } from "helmet";
import { AppModule } from "./app.module";
import { createUserInputError } from "./exception-handling";
import { createWinstonLogger } from "./winston-logger";

// Development Helmet options so we can use GraphQL playground
const devHelmetOptions: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      "img-src": ["'self'", "data:", "https://cdn.jsdelivr.net"],
    },
  },
};

async function bootstrap() {
  const logger = createWinstonLogger();
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger,
  });
  const config = app.get(ConfigService);

  // TODO: check that all the required environment variables are defined!

  // Protection from some well-known web vulnerabilities by setting HTTP headers appropriately
  app.use(helmet(config.get<string>("NODE_ENV") === "development" ? devHelmetOptions : undefined));

  // Enabling input data validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: createUserInputError,
      forbidUnknownValues: true,
    })
  );

  // TODO: use CORS? Origins 'localhost' and '127.0.0.1' are different.
  // CORS
  // const webDomain = config.get<string>("WEB_DOMAIN");
  // if (webDomain === undefined) {
  //   const errorMsg = "MAFIL-PSQ web app URL is not defined! Shutting down…";
  //   logger.error(errorMsg);
  //   throw new Error(errorMsg);
  // }
  // app.enableCors({ origin: [webDomain] });

  // Setting up the port
  const port = config.get<number>("PORT");

  if (port === undefined) {
    const errorMsg = "MAFIL-PSQ server port is not defined! Shutting down…";
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Starting the app
  logger.log(`MAFIL-PSQ server is listening on: http://localhost:${port}`);
  await app.listen(port);
}

void bootstrap();
