import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GraphQLApiModule } from "./api/graphql-api.module";
import { GraphQLConfigService } from "./api/graphql-config.service";
import { AuthModule } from "./auth/auth.module";

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
})
export class AppModule {}
