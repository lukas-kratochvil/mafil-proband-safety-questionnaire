import { GraphQLScalarType } from "graphql";

export const Void = new GraphQLScalarType({
  name: "Void",
  description: "Returns nothing.",
  serialize: (_value) => null,
  parseValue: (_value) => null,
  parseLiteral: (_ast) => null,
});
