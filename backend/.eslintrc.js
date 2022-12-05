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
    tsconfigRootDir : __dirname,
  },
};
