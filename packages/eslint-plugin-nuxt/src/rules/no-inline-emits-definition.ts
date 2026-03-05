import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { checkCallExpressionName } from "../utils/ast";
import { isVueFile } from "../utils/filename";
import { createRule, withTemplateVisitor } from "../utils/rule";

export const noInlineEmitsDefinition = createRule({
  name: "no-inline-emits-definition",
  meta: {
    docs: {
      description:
        "Disallow inline emits definition if property count exceeds limit.",
    },
    type: "suggestion",
    messages: {
      "issue:empty-inline-emits":
        "Avoid using an empty type for emits definition. Use type-based declaration instead.",
      "issue:inline-emits":
        "Avoid using inline emits with greater than {{limit}} events. Extract to a named interface/type.",
    },
    schema: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            eventsLimit: { type: "number" },
          },
        },
      ],
    },
    defaultOptions: [{ eventsLimit: 2 }],
    hasSuggestions: false,
  },
  create: (context) => {
    if (!isVueFile(context.filename)) return {};

    return withTemplateVisitor(context, {
      script: {
        CallExpression(node) {
          if (checkCallExpressionName(node, "defineEmits")) {
            const hasTypeParameter = !!(
              node.typeArguments && node.typeArguments.params.length > 0
            );

            if (!hasTypeParameter) {
              return;
            }

            if (
              node.typeArguments?.params[0].type ===
              AST_NODE_TYPES.TSTypeLiteral
            ) {
              const memberCount = node.typeArguments.params[0].members.length;

              if (memberCount === 0) {
                context.report({
                  node,
                  messageId: "issue:empty-inline-emits",
                });

                return;
              }

              if (memberCount > context.options[0].eventsLimit) {
                context.report({
                  node,
                  messageId: "issue:inline-emits",
                  data: {
                    limit: context.options[0].eventsLimit,
                  },
                });
              }
            }
          }
        },
      },
    });
  },
});
