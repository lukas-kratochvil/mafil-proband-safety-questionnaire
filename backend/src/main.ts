import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT");

  if (port === undefined) {
    throw new Error("MAFIL-PSQ server port is not defined! Shutting down…");
  }

  console.log(`MAFIL-PSQ server is listening on: http://localhost:${port}`);
  await app.listen(port);
}

bootstrap();
