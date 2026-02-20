import { Linter } from "eslint";
import pluginTest from "@timedoor/eslint-plugin-nuxt";

const eslintConfig: Linter.Config = {
  files: ["**/*.ts", "**/*.vue"],
  plugins: {
    "@timedoor/eslint-plugin-nuxt": pluginTest,
  },
  ...pluginTest.configs.recommended,
  rules: {
    ...pluginTest.configs.recommended.rules,
  },
};

export = eslintConfig;
