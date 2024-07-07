import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction) {
    const { body, ip, method, originalUrl } = request;
    const userAgent = request.get("user-agent") ?? "";

    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");
      this.logger.log(
        `${method} ${originalUrl} ${body.operationName} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
      );
    });
    next();
  }
}
