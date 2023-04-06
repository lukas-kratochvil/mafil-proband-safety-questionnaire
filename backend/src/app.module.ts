import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { GraphQLApiModule } from "./api/graphql-api.module";
import { CronModule } from "./cron/cron.module";
import { AuthGuardModule } from "./guards/auth/auth.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";

@Module({
  imports: [ConfigModule.forRoot(), GraphQLApiModule, AuthGuardModule, CronModule, ScheduleModule.forRoot()],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
