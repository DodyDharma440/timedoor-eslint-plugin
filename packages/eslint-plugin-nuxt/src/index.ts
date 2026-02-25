import { ESLint, Linter } from "eslint";
import { rules } from "./rules";

type Plugin = Omit<ESLint.Plugin, "configs"> & {
  configs: ESLint.Plugin["configs"] & {
    recommended: Linter.Config;
  };
};

const plugin: Plugin = {
  meta: {
    name: "@timedoor/eslint-plugin-nuxt",
    version: "0.0.1",
  },
  rules,
  configs: {
    recommended: {
      rules: {
        "@timedoor/nuxt/my-rule": "error",
        "@timedoor/nuxt/enforce-component-directory-structure": "error",
      },
    },
  },
};

export = plugin;
