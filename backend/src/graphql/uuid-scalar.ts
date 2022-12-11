import { GraphQLScalarType } from "graphql";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validateUuid = (uuid: unknown): string | never => {
  if (typeof uuid !== "string" || !uuidRegex.test(uuid)) {
    throw new Error("Invalid UUID!");
  }
  return uuid;
};

export const UuidScalar = new GraphQLScalarType({
  name: "UUID",
  description: "UUID parser.",
  serialize: (value) => validateUuid(value),
  parseValue: (value) => validateUuid(value),
  parseLiteral: (ast) => validateUuid(ast.kind),
});
