module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    "plugin:@darraghor/nestjs-typed/recommended",
    "plugin:@darraghor/nestjs-typed/no-swagger",
    "../.eslintrc.js", // this has to be the last extension!!
  ],
  plugins: ["@darraghor/nestjs-typed"],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@darraghor/nestjs-typed/injectable-should-be-provided": [
      "warn",
      {
        src: ["src/**/*.ts"],
        filterFromPaths: [".spec."],
      },
    ],
    "@darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator": [
      "error",
      { additionalTypeDecorators: ["Field", "HideField"] }, // Field and HideField is used in GraphlQL DTOs to provide metadata about the property type
    ],
  },
};
