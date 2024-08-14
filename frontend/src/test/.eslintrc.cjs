module.exports = {
  extends: "../../.eslintrc.cjs",
  rules: {
    // we must import test libraries from the devDependencies of the package.json
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
  }
};
