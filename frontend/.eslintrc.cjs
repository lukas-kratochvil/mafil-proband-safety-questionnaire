module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:testing-library/react",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  overrides: [
    {
      files: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "react-hooks-addons", "testing-library", "@typescript-eslint", "prettier"],
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
    "react/function-component-definition": [2, { namedComponents: "arrow-function" }],
    "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
    "react/jsx-first-prop-new-line": [1, "multiline"],
    "react/jsx-max-props-per-line": [1, { maximum: { single: 3, multi: 1 } }],
    "react/jsx-no-duplicate-props": [1, { ignoreCase: false }],
    "react/jsx-props-no-spreading": "off",
    "react/no-array-index-key": "warn",
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": "off",
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks-addons/no-unused-deps": "warn",
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};