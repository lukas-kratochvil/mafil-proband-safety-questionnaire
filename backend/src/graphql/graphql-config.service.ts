import * as path from "path";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlOptionsFactory } from "@nestjs/graphql";
import { UuidScalar } from "./scalars/uuid-scalar";

@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: path.join(process.cwd(), "src/graphql/generated-schema.gql"),
      resolvers: {
        UUID: UuidScalar,
      },
      debug: this.configService.get<string>("NODE_ENV") === "development",
      playground: this.configService.get<string>("NODE_ENV") === "development",
    };
  }
}
