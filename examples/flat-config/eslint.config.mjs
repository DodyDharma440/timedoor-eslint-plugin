// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import timedoorConfig from "@timedoor/eslint-config-nuxt/flat";

export default withNuxt([
  {
    ...timedoorConfig,
    rules: {
      ...timedoorConfig.rules,
      "@timedoor/nuxt/enforce-component-directory-structure": [
        "error",
        { allowedDirs: ["dialogs"] },
      ],
    },
  },
]);
