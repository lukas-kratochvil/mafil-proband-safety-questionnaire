module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "plugin:i18next/recommended",
    "plugin:react/recommended",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended",
    "../.eslintrc.js", // this has to be the last extension!!
  ],
  overrides: [
    {
      files: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
      extends: ["plugin:testing-library/react", "plugin:jest-dom/recommended"],
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["i18next", "react", "react-hooks", "react-hooks-addons", "@tanstack/query", "testing-library"],
  rules: {
    camelcase: "off",
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
    "@typescript-eslint/no-non-null-assertion": "off", // using non-null-assertion only in dev and test files
    '@typescript-eslint/consistent-type-imports': 'error',
  },
};
