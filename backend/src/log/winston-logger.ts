import { LoggerService } from "@nestjs/common";
import { utilities as nestWinstonModuleUtilities, WinstonModule } from "nest-winston";
import * as winston from "winston";
import type { EnvironmentVariables } from "@app/config";

const defaultFileTransportOptions: winston.transports.FileTransportOptions = {
  dirname: "logs",
};

export const createWinstonLogger = (nodeEnv: EnvironmentVariables["NODE_ENV"]): LoggerService => {
  const winstonLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    transports: [
      new winston.transports.File({ ...defaultFileTransportOptions, filename: "error.log", level: "error" }),
      new winston.transports.File({ ...defaultFileTransportOptions, filename: "all.log" }),
    ],
  });

  // Log to the console if we're not in the production
  if (nodeEnv !== "production") {
    winstonLogger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike("MAFIL-PSQ", {
            colors: true,
            prettyPrint: true,
          })
        ),
      })
    );
  }

  return WinstonModule.createLogger(winstonLogger);
};
