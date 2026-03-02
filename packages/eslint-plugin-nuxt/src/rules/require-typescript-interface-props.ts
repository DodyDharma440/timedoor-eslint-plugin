import { checkCallExpressionName } from "../utils/ast";
import { isVueFile } from "../utils/filename";
import { createRule, withTemplateVisitor } from "../utils/rule";

export const requireTypescriptInterfaceProps = createRule({
  name: "require-typescript-interface-props",
  meta: {
    docs: {
      description:
        "Enforce using TypeScript type arguments for component props.",
    },
    type: "suggestion",
    messages: {
      "issue:missing-type-parameter":
        "defineProps() must use a type argument (e.g., defineProps<Props>()).",
      "issue:runtime-declaration":
        "Avoid runtime prop declaration when using TypeScript. Use type-based declaration instead.",
    },
    schema: [],
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
              context.report({
                node,
                messageId: "issue:missing-type-parameter",
              });

              return;
            }

            const hasRuntimeArguments = node.arguments.length > 0;

            if (hasRuntimeArguments) {
              context.report({
                node,
                messageId: "issue:runtime-declaration",
              });
            }
          }
        },
      },
    });
  },
});
