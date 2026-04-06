import { ESLint } from "eslint";
import { standardRules } from "./rules/standard";

const eslintConfig: ESLint.ConfigData = {
  plugins: [
    "@timedoor/nuxt",
    "vue",
    "@typescript-eslint",
    "regexp",
    "import",
    "promise",
    "sonarjs",
    "case-police",
  ],
  extends: [
    "plugin:@timedoor/nuxt/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended-legacy",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/recommended",
    "plugin:case-police/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: false,
    },
  },
  overrides: [
    {
      files: ["**/*.vue"],
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
  ],
  rules: { ...standardRules },
  ignorePatterns: [
    ".nuxt",
    ".output",
    "dist",
    "node_modules",
    ".git",
    "*.min.js",
    "coverage",
  ],
};

export = eslintConfig;
