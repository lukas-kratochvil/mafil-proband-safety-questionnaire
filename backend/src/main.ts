import fs from "fs";
import { LoggerService, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet, { HelmetOptions } from "helmet";
import { AppModule } from "./app.module";
import { EnvironmentVariables } from "./config.interface";
import { createUserInputError } from "./exception/exception-handling";
import { createWinstonLogger } from "./log/winston-logger";
import { GENERATED_DIR_PATH, GENERATED_PDF_DIR_PATH } from "./utils/paths";

const createFolder = (folderPath: string, logger: LoggerService): void => {
  if (fs.existsSync(folderPath)) {
    logger.log(`Folder ${folderPath} already exists.`);
  } else {
    fs.mkdirSync(folderPath);
    logger.log(`Created '${folderPath}' folder.`);
  }
};

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
  const config = app.get(ConfigService<EnvironmentVariables, true>);

  // Create a folder for generated files such as GraphQL schema
  createFolder(GENERATED_DIR_PATH, logger);

  // Create a folder for generated development PDFs
  if (config.get("NODE_ENV", { infer: true }) === "development") {
    createFolder(GENERATED_PDF_DIR_PATH, logger);
  }

  // Protection from some well-known web vulnerabilities by setting HTTP headers appropriately
  app.use(helmet(config.get("NODE_ENV", { infer: true }) === "development" ? devHelmetOptions : undefined));

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
  // const webDomain = config.get("WEB_DOMAIN", { infer: true });
  // if (webDomain === undefined) {
  //   const errorMsg = "MAFIL-PSQ web app URL is not defined! Shutting down…";
  //   logger.error(errorMsg);
  //   throw new Error(errorMsg);
  // }
  // app.enableCors({ origin: [webDomain] });

  // Starting the app
  const port = config.get("PORT", { infer: true });
  logger.log(`MAFIL-PSQ server is listening on: http://localhost:${port}`);
  await app.listen(port);
}

void bootstrap();
