import { ESLint } from "eslint";
import { standardRules } from "./rules/standard";

const eslintConfig: ESLint.ConfigData = {
  plugins: [
    "@timedoor/eslint-plugin-nuxt",
    "vue",
    "@typescript-eslint",
    "regexp",
  ],
  extends: [
    "plugin:@timedoor/eslint-plugin-nuxt/recommended",
    "plugin:vue/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:case-police/recommended",
  ],
  overrides: [
    {
      files: ["*.ts"],
    },
  ],
  rules: { ...standardRules },
};

export = eslintConfig;
