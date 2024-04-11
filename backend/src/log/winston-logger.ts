import { LoggerService } from "@nestjs/common";
import { utilities as nestWinstonModuleUtilities, WinstonModule } from "nest-winston";
import * as winston from "winston";
import type { EnvironmentVariables } from "@app/config";

const defaultFileTransportOptions: winston.transports.FileTransportOptions = {
  dirname: "logs",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    winston.format.prettyPrint()
  ),
};

export const createWinstonLogger = (nodeEnv: EnvironmentVariables["NODE_ENV"]): LoggerService => {
  const winstonLogger = winston.createLogger({
    level: "info",
    transports: [
      new winston.transports.File({ ...defaultFileTransportOptions, filename: "error.log", level: "error" }),
      new winston.transports.File({ ...defaultFileTransportOptions, filename: "all.log" }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike("REG_BACKEND", {
            colors: true,
            prettyPrint: nodeEnv !== "production",
          }),
        ),
      }),
    ],
  });

  return WinstonModule.createLogger(winstonLogger);
};
