import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ScheduleModule } from "@nestjs/schedule";
import { GraphQLApiModule } from "./api/graphql-api.module";
import { GraphQLConfigService } from "./api/graphql-config.service";
import { CronModule } from "./cron/cron.module";
import { AuthGuardModule } from "./guards/auth/auth.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useClass: GraphQLConfigService,
    }),
    GraphQLApiModule,
    AuthGuardModule,
    CronModule,
    ScheduleModule.forRoot(),
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
