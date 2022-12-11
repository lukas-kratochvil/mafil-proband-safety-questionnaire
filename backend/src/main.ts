import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT") as number;
  console.log(`NestJS server is listening on: http://localhost:${port}`);
  await app.listen(port);
}

bootstrap();
