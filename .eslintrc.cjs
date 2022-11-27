module.exports = {
  root: true,
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier", // this has to be the last extension!!
  ],
  plugins: ["@typescript-eslint", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "import/extensions": ["error", "ignorePackages", { ts: "never", tsx: "never" }],
    "import/no-duplicates": "off",
    "import/no-extraneous-dependencies": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "never",
        alphabetize: { order: "asc" },
        groups: ["builtin", "external", "internal", "parent", "sibling"],
      },
    ],
    "import/prefer-default-export": "off",
    "operator-linebreak": ["error", "before"],
    "no-multiple-empty-lines": "error",
    "no-plusplus": "off",
    "no-shadow": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { args: "all", argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-shadow": "error",
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
