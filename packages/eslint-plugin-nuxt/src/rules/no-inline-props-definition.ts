import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { checkCallExpressionName } from "../utils/ast-checker";
import { isVueFile } from "../utils/filename";
import { createRule, withTemplateVisitor } from "../utils/rule";

export const noInlinePropsDefinition = createRule({
  name: "no-inline-props-definition",
  meta: {
    docs: {
      description: "Disallow inline props definition in Vue components",
    },
    type: "suggestion",
    messages: {
      "issue:empty-inline-object":
        "Avoid using an empty object for props definition. Use type-based declaration instead.",
      "issue:inline-object":
        "Avoid using inline object with greater than {{limit}} properties for props definition. Use type-based declaration instead.",
    },
    schema: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            propertiesLimit: { type: "number" },
          },
        },
      ],
    },
    defaultOptions: [{ propertiesLimit: 2 }],
    hasSuggestions: false,
  },
  create: (context) => {
    if (!isVueFile(context.filename)) return {};

    return withTemplateVisitor(context, {
      script: {
        CallExpression(node) {
          if (checkCallExpressionName(node, "defineProps")) {
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
                  messageId: "issue:empty-inline-object",
                });

                return;
              }

              if (memberCount > context.options[0].propertiesLimit) {
                context.report({
                  node,
                  messageId: "issue:inline-object",
                  data: {
                    limit: context.options[0].propertiesLimit,
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
