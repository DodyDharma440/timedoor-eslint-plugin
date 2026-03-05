import { createNoDirectAnyRule } from "../utils/define-macro-rule";

export const noDirectAnyInProps = createNoDirectAnyRule({
  macroName: "defineProps",
  ruleName: "no-direct-any-in-props",
  description: "Disallow 'any' type in component props definition.",
  messageId: "issue:any-in-props",
  messageText: "Avoid using 'any' type in props. Use specific types instead.",
});
