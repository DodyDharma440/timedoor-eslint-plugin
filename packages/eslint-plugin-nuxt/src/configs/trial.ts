import { Linter } from "eslint";

const config: Linter.Config = {
  rules: {
    "tmdr-nuxt/enforce-component-directory-structure": "warn",
    "tmdr-nuxt/require-typescript-interface-props": "warn",
    "tmdr-nuxt/no-direct-any-in-props": "warn",
    "tmdr-nuxt/no-inline-props-definition": "warn",
    "tmdr-nuxt/props-interface-name": "warn",
    "tmdr-nuxt/require-typed-emits-signature": "warn",
    "tmdr-nuxt/no-direct-any-in-emits": "warn",
    "tmdr-nuxt/no-inline-emits-definition": "warn",
    "tmdr-nuxt/emits-interface-name": "warn",
    "tmdr-nuxt/no-composable-in-class": "warn",
    "tmdr-nuxt/async-data-top-level": "warn",
    "tmdr-nuxt/no-async-data-outside-setup": "warn",
    "tmdr-nuxt/no-direct-api-call-in-component": "warn",
    "tmdr-nuxt/no-manual-repository-import": "warn",
    "tmdr-nuxt/require-typed-repository": "warn",
    "tmdr-nuxt/require-pinia-composition-api": "warn",
  },
};

export default config;
