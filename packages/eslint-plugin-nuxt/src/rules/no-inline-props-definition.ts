import { createNoInlineDefinitionRule } from "../utils/define-macro-rule";

export const noInlinePropsDefinition = createNoInlineDefinitionRule({
  macroName: "defineProps",
  ruleName: "no-inline-props-definition",
  description:
    "Disallow inline props definition if property count exceeds limit.",
  limitOptionKey: "propertiesLimit",
  defaultLimit: 2,
  emptyMessageId: "issue:empty-inline-object",
  emptyMessageText:
    "Avoid using an empty object for props definition. Use type-based declaration instead.",
  inlineMessageId: "issue:inline-object",
  inlineMessageText:
    "Avoid using inline object with greater than {{limit}} properties for props definition. Use type-based declaration instead.",
});
