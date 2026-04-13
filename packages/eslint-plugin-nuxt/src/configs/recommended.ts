import { Linter } from "eslint";

const config: Linter.Config = {
  rules: {
    "tmdr-nuxt/enforce-component-directory-structure": "error",
    "tmdr-nuxt/require-typescript-interface-props": "error",
    "tmdr-nuxt/no-direct-any-in-props": "error",
    "tmdr-nuxt/no-inline-props-definition": "error",
    "tmdr-nuxt/props-interface-name": "error",
    "tmdr-nuxt/require-typed-emits-signature": "error",
    "tmdr-nuxt/no-direct-any-in-emits": "error",
    "tmdr-nuxt/no-inline-emits-definition": "error",
    "tmdr-nuxt/emits-interface-name": "error",
    "tmdr-nuxt/no-composable-in-class": "error",
    "tmdr-nuxt/async-data-top-level": "error",
    "tmdr-nuxt/no-async-data-outside-setup": "error",
    "tmdr-nuxt/no-direct-api-call-in-component": "error",
    "tmdr-nuxt/no-manual-repository-import": "error",
    "tmdr-nuxt/require-typed-repository": "error",
    "tmdr-nuxt/require-pinia-composition-api": "error",
  },
};

export default config;
