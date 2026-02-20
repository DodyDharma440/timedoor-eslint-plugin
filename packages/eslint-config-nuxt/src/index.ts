import { ESLint } from "eslint";

const eslintConfig: ESLint.ConfigData = {
  plugins: ["@timedoor/eslint-plugin-nuxt"],
  extends: ["plugin:@timedoor/eslint-plugin-nuxt/recommended"],
  overrides: [
    {
      files: ["*.ts"],
    },
  ],
};

export = eslintConfig;
