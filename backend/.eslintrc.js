module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    "../.eslintrc.js", // this has to be the last extension!!
  ],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir : __dirname,
  },
};
