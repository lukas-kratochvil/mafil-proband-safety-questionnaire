import fs from "fs";
import { LoggerService, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet, { HelmetOptions } from "helmet";
import { AppModule } from "./app.module";
import { EnvironmentVariables } from "./config/validation";
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
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<EnvironmentVariables, true>);
  const nodeEnv = config.get("nodeEnv", { infer: true });

  // Setup logger
  const logger = createWinstonLogger();
  app.useLogger(logger);

  // Create a folder for generated files such as GraphQL schema
  createFolder(GENERATED_DIR_PATH, logger);

  // Create a folder for generated development PDFs
  if (nodeEnv === "development") {
    createFolder(GENERATED_PDF_DIR_PATH, logger);
  }

  // Protection from some well-known web vulnerabilities by setting HTTP headers appropriately
  const helmetOptions = nodeEnv === "development" ? devHelmetOptions : undefined;
  app.use(helmet(helmetOptions));

  // Enabling input data validation
  app.useGlobalPipes(
    // eslint-disable-next-line @darraghor/nestjs-typed/should-specify-forbid-unknown-values
    new ValidationPipe({
      transform: true,
      exceptionFactory: createUserInputError,
      // FIXME: `forbidUnknownValues` should be `true`, but there is a bug in `class-validator` (https://github.com/typestack/class-validator/issues/1873#)
      forbidUnknownValues: false,
      enableDebugMessages: nodeEnv === "development",
    })
  );

  // CORS
  const webUrl = config.get("webUrl", { infer: true });
  app.enableCors({ origin: webUrl });

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // Starting the app
  const port = config.get("port", { infer: true });
  logger.log(`MAFIL-PSQ server is listening on: http://localhost:${port}`);
  await app.listen(port);
}

void bootstrap();
