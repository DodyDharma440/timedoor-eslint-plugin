import { createRule, withTemplateVisitor } from "../utils/rule";

export const requirePiniaCompositionApi = createRule({
  name: "require-pinia-composition-api",
  meta: {
    docs: {
      description: "Enforce Composition API style for Pinia store definitions.",
    },
    type: "problem",
    messages: {
      "issue:options-api":
        "Pinia store must use Composition API style. Replace object literal with setup function in defineStore().",
    },
    schema: [],
    defaultOptions: [],
    hasSuggestions: false,
  },
  create: (context) => {
    return withTemplateVisitor(context, {
      script: {
        CallExpression(node) {
          const callee = node.callee;
          if (
            callee.type === "Identifier" &&
            callee.name === "defineStore" &&
            node.arguments.length >= 2
          ) {
            const secondArg = node.arguments[1];
            if (secondArg.type === "ObjectExpression") {
              context.report({
                node: secondArg,
                messageId: "issue:options-api",
              });
            }
          }
        },
      },
    });
  },
});
