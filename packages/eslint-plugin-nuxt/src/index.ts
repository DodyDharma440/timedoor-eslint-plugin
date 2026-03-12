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
        "@timedoor/nuxt/enforce-component-directory-structure": "error",
        "@timedoor/nuxt/require-typescript-interface-props": "error",
        "@timedoor/nuxt/no-direct-any-in-props": "error",
        "@timedoor/nuxt/no-inline-props-definition": "error",
        "@timedoor/nuxt/props-interface-name": "error",
        "@timedoor/nuxt/require-typed-emits-signature": "error",
        "@timedoor/nuxt/no-direct-any-in-emits": "error",
        "@timedoor/nuxt/no-inline-emits-definition": "error",
        "@timedoor/nuxt/emits-interface-name": "error",
        "@timedoor/nuxt/no-composable-in-class": "error",
        "@timedoor/nuxt/async-data-top-level": "error",
        "@timedoor/nuxt/no-async-data-outside-setup": "error",
        "@timedoor/nuxt/no-direct-api-call-in-component": "error",
        "@timedoor/nuxt/no-manual-repository-import": "error",
      },
    },
  },
};

export = plugin;
