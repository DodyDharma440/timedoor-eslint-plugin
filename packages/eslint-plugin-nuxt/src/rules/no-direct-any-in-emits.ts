import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule, withTemplateVisitor } from "../utils/rule";
import { isVueFile } from "../utils/filename";
import { checkCallExpressionName } from "../utils/ast";

export const noDirectAnyInEmits = createRule({
  name: "no-direct-any-in-emits",
  meta: {
    docs: {
      description: "Disallow 'any' type in component emits definition.",
    },
    type: "problem",
    messages: {
      "issue:any-in-emits":
        "Avoid using 'any' type in emits. Use specific types instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowUnknown: {
            type: "boolean",
            description: "Allow 'unknown' type in emits. Default is false.",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ allowUnknown: false }],
    hasSuggestions: false,
  },
  create: (context) => {
    if (!isVueFile(context.filename)) return {};

    const allowUnknown = context.options[0]?.allowUnknown ?? false;

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

            const disallowedTypes = [AST_NODE_TYPES.TSAnyKeyword];
            if (!allowUnknown) {
              disallowedTypes.push(AST_NODE_TYPES.TSUnknownKeyword);
            }

            if (
              node.typeArguments &&
              disallowedTypes.includes(node.typeArguments?.params[0].type)
            ) {
              context.report({
                node,
                messageId: "issue:any-in-emits",
              });
            }
          }
        },
      },
    });
  },
});
