module.exports = {
  env: {
    node: true,
  },
  extends: [
    "plugin:@darraghor/nestjs-typed/recommended",
    "plugin:@darraghor/nestjs-typed/no-swagger",
    "../.eslintrc.js", // this has to be the last extension!!
  ],
  overrides: [
    {
      files: ["./**/*.spec.ts", "./**/*.test.ts"],
      rules: {
        "@typescript-eslint/no-floating-promises": "off"
      }
    }
  ],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@darraghor/nestjs-typed"],
  rules: {
    "@darraghor/nestjs-typed/injectable-should-be-provided": [
      "warn",
      {
        src: ["src/**/*.ts"],
        filterFromPaths: [".spec.", ".test."],
      },
    ],
    "@darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator": [
      "error",
      // Input data structure is validated by the GraphQL schema
      // Field and HideField is used in GraphlQL DTOs to provide metadata about the property type
      { additionalTypeDecorators: ["Field", "HideField"] },
    ],
  }
};
