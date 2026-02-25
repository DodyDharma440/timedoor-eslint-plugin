import { ESLint } from "eslint";
import { myRule } from "./my-rule";
import { enforceComponentDirectoryStructure } from "./enforce-component-directory-structure";

export const rules = {
  "my-rule": myRule,
  "enforce-component-directory-structure": enforceComponentDirectoryStructure,
} as unknown as ESLint.Plugin["rules"];
