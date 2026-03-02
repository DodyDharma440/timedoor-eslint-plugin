import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule, withTemplateVisitor } from "../utils/rule";
import { isVueFile } from "../utils/filename";
import { checkCallExpressionName } from "../utils/ast";

export const noDirectAnyInProps = createRule({
  name: "no-direct-any-in-props",
  meta: {
    docs: {
      description: "Disallow the use of `any` type in props",
    },
    type: "suggestion",
    messages: {
      "issue:any-in-props":
        "Avoid using 'any' type in props. Use specific types instead.",
    },
    schema: [],
    defaultOptions: [],
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
              node.typeArguments?.params[0].type === AST_NODE_TYPES.TSAnyKeyword
            ) {
              context.report({
                node,
                messageId: "issue:any-in-props",
              });
            }
          }
        },
      },
    });
  },
});
