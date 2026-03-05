import { createNoInlineDefinitionRule } from "../utils/define-macro-rule";

export const noInlineEmitsDefinition = createNoInlineDefinitionRule({
  macroName: "defineEmits",
  ruleName: "no-inline-emits-definition",
  description:
    "Disallow inline emits definition if property count exceeds limit.",
  limitOptionKey: "eventsLimit",
  defaultLimit: 2,
  emptyMessageId: "issue:empty-inline-emits",
  emptyMessageText:
    "Avoid using an empty type for emits definition. Use type-based declaration instead.",
  inlineMessageId: "issue:inline-emits",
  inlineMessageText:
    "Avoid using inline emits with greater than {{limit}} events. Extract to a named interface/type.",
});
