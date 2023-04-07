import { BadRequestException } from "@nestjs/common";
import { GraphQLScalarType } from "graphql";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validateUuid = (uuid: unknown): string | never => {
  if (typeof uuid === "string" && UUID_REGEX.test(uuid)) {
    return uuid;
  }
  throw new BadRequestException("Invalid UUID!");
};

export const UUID = new GraphQLScalarType({
  name: "UUID",
  description: "UUID parser.",
  serialize: (value) => validateUuid(value),
  parseValue: (value) => validateUuid(value),
  parseLiteral: (ast) => validateUuid(ast.kind),
});
