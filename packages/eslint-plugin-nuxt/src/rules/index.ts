import { ESLint } from "eslint";
import { myRule } from "./my-rule";
import { enforceComponentDirectoryStructure } from "./enforce-component-directory-structure";
import { requireTypescriptInterfaceProps } from "./require-typescript-interface-props";
import { noDirectAnyInProps } from "./no-direct-any-in-props";
import { noInlinePropsDefinition } from "./no-inline-props-definition";

export const rules = {
  "my-rule": myRule,
  "enforce-component-directory-structure": enforceComponentDirectoryStructure,
  "require-typescript-interface-props": requireTypescriptInterfaceProps,
  "no-direct-any-in-props": noDirectAnyInProps,
  "no-inline-props-definition": noInlinePropsDefinition,
} as unknown as ESLint.Plugin["rules"];
