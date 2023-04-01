import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GraphQLApiModule } from "./api/graphql-api.module";
import { GraphQLConfigService } from "./api/graphql-config.service";
import { AuthModule } from "./auth/auth.module";
import { LoggerMiddleware } from "./log/logger.middleware";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useClass: GraphQLConfigService,
    }),
    GraphQLApiModule,
    AuthModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
