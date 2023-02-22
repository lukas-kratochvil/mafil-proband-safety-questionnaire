import * as path from "path";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlOptionsFactory } from "@nestjs/graphql";
import { UuidScalar } from "./scalars/uuid-scalar";

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class GraphQLConfigService implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: path.join(process.cwd(), "graphql-schema.gql"),
      resolvers: {
        UUID: UuidScalar,
      },
      debug: this.configService.get<string>("NODE_ENV") === "development",
      playground: this.configService.get<string>("NODE_ENV") === "development",
    };
  }
}
