import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule, withTemplateVisitor } from "../utils/rule";

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
    return withTemplateVisitor(context, {
      script: {
        CallExpression(node) {
          console.log(
            "parser service => ",
            context.sourceCode.parserServices?.program,
          );
          if (
            node.callee.type === AST_NODE_TYPES.Identifier &&
            node.callee.name === "defineProps"
          ) {
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
