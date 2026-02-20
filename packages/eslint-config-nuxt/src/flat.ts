import { Linter } from "eslint";
import pluginTimedoor from "@timedoor/eslint-plugin-nuxt";

const eslintConfig: Linter.Config = {
  files: ["**/*.ts", "**/*.vue"],
  plugins: {
    "@timedoor/nuxt": pluginTimedoor,
  },
  ...pluginTimedoor.configs.recommended,
  rules: {
    ...pluginTimedoor.configs.recommended.rules,
  },
};

export = eslintConfig;
