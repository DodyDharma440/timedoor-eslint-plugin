// packages/eslint-config-nuxt/src/index.ts
import type { Linter } from "eslint";
import pluginTimedoor from "@timedoor/eslint-plugin-nuxt";
// @ts-expect-error: No types available for these plugins
import pluginPromise from "eslint-plugin-promise";
import pluginSonarJs from "eslint-plugin-sonarjs";
import pluginCasePolice from "eslint-plugin-case-police";
import pluginRegexp from "eslint-plugin-regexp";
import { standardRules } from "./rules/standard";

interface TimedoorNuxtConfigOptions {
  rules?: Linter.RulesRecord;
  files?: string[];
  disableRules?: string[];
  env?: { mode?: "development" | "production" };
}

const pluginPresets = [
  pluginPromise.configs["flat/recommended"],
  pluginSonarJs.configs?.recommended,
  ...pluginCasePolice.configs.recommended,
  pluginRegexp.configs["flat/recommended"],
].filter(Boolean) as Linter.Config[];

const createConfig = (
  options: TimedoorNuxtConfigOptions = {},
): Linter.Config[] => {
  const {
    rules: userRules = {},
    files = ["**/*.ts", "**/*.vue"],
    disableRules = [],
  } = options;

  // ─────────────────────────────────────────────────────
  // LAYER 1: Timedoor plugin rules
  // ─────────────────────────────────────────────────────
  const timedoorRules = { ...pluginTimedoor.configs.recommended.rules };
  disableRules
    .filter((name) => name.startsWith("@timedoor/nuxt"))
    .forEach((ruleName) => {
      delete timedoorRules[ruleName];
    });

  // ─────────────────────────────────────────────────────
  // MERGE RULES
  // ─────────────────────────────────────────────────────
  const mergedRules = { ...timedoorRules, ...standardRules, ...userRules };

  // ─────────────────────────────────────────────────────
  // MAIN CONFIG — Plugins ALWAYS registered here ✅
  // ─────────────────────────────────────────────────────
  const mainConfig: Linter.Config = {
    files,
    plugins: {
      "@timedoor/nuxt": pluginTimedoor,
    },
    rules: mergedRules,
  };

  const configs: Linter.Config[] = [mainConfig];

  return configs;
};

export { createConfig, pluginPresets };
