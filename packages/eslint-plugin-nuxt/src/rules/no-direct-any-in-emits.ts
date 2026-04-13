import { createNoDirectAnyRule } from "../utils/define-macro-rule";

export const noDirectAnyInEmits = createNoDirectAnyRule({
  macroName: "defineEmits",
  ruleName: "no-direct-any-in-emits",
  description: "Disallow 'any' type in component emits definition.",
  messageId: "issue:any-in-emits",
  messageText: "Avoid using 'any' type in emits. Use specific types instead.",
});
