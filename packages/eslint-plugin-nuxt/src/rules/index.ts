import { ESLint } from "eslint";
import { myRule } from "./my-rule";

export const rules = {
  "my-rule": myRule,
} as unknown as ESLint.Plugin["rules"];
