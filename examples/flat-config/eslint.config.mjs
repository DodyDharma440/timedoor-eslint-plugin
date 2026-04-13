// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import { createConfig, pluginPresets } from "eslint-config-tmdr-nuxt";

export default withNuxt([
  ...createConfig({
    rules: {
      "tmdr-nuxt/enforce-component-directory-structure": [
        "error",
        { allowedDirs: ["dialogs"] },
      ],
      "tmdr-nuxt/no-inline-props-definition": ["warn", { propertiesLimit: 0 }],
      "tmdr-nuxt/no-manual-repository-import": [
        "warn",
        { forbiddenPaths: ["utils"], overrideDefaults: false },
      ],
    },
  }),
  {
    rules: {
      "no-console": "error",
    },
  },
]).prepend(pluginPresets);
