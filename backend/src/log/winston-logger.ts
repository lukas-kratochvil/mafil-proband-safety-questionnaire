import { LoggerService } from "@nestjs/common";
import { utilities as nestWinstonModuleUtilities, WinstonModule } from "nest-winston";
import * as winston from "winston";

const defaultFileTransportOptions: winston.transports.FileTransportOptions = {
  dirname: "logs",
};

export const createWinstonLogger = (): LoggerService => {
  const winstonLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    transports: [
      new winston.transports.File({ ...defaultFileTransportOptions, filename: "error.log", level: "error" }),
      new winston.transports.File({ ...defaultFileTransportOptions, filename: "all.log" }),
    ],
  });

  // Log to the console if we're not in the production
  if (process.env.NODE_ENV !== "production") {
    winstonLogger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike("MAFILDB-PSQ", {
            colors: true,
            prettyPrint: true,
          })
        ),
      })
    );
  }

  return WinstonModule.createLogger(winstonLogger);
};
