import { ESLint } from "eslint";
import { myRule } from "./my-rule";
import { enforceComponentDirectoryStructure } from "./enforce-component-directory-structure";
import { requireTypescriptInterfaceProps } from "./require-typescript-interface-props";
import { noDirectAnyInProps } from "./no-direct-any-in-props";
import { noInlinePropsDefinition } from "./no-inline-props-definition";
import { propsInterfaceName } from "./props-interface-name";
import { requireTypedEmitsSignature } from "./require-typed-emits-signature";
import { emitsInterfaceName } from "./emits-interface-name";
import { noDirectAnyInEmits } from "./no-direct-any-in-emits";
import { noInlineEmitsDefinition } from "./no-inline-emits-definition";
import { noComposableInClass } from "./no-composable-in-class";

export const rules = {
  "my-rule": myRule,
  "enforce-component-directory-structure": enforceComponentDirectoryStructure,
  "require-typescript-interface-props": requireTypescriptInterfaceProps,
  "no-direct-any-in-props": noDirectAnyInProps,
  "no-inline-props-definition": noInlinePropsDefinition,
  "props-interface-name": propsInterfaceName,
  "require-typed-emits-signature": requireTypedEmitsSignature,
  "no-direct-any-in-emits": noDirectAnyInEmits,
  "no-inline-emits-definition": noInlineEmitsDefinition,
  "emits-interface-name": emitsInterfaceName,
  "no-composable-in-class": noComposableInClass,
} as unknown as ESLint.Plugin["rules"];
