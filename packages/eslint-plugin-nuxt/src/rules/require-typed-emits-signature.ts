import { checkCallExpressionName } from "../utils/ast";
import { isVueFile } from "../utils/filename";
import { createRule, withTemplateVisitor } from "../utils/rule";

export const requireTypedEmitsSignature = createRule({
  name: "require-typed-emits-signature",
  meta: {
    docs: {
      description: "Require typed signature for defineEmits.",
    },
    type: "suggestion",
    messages: {
      "issue:no-typed-emits":
        "defineEmits should use TypeScript type definition, not string array.",
    },
    schema: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            allowStringArray: { type: "boolean" },
          },
          additionalProperties: false,
        },
      ],
    },
    defaultOptions: [{ allowStringArray: false }],
    hasSuggestions: false,
  },
  create: (context) => {
    if (!isVueFile(context.filename)) return {};

    const allowStringArray = context.options[0]?.allowStringArray ?? false;

    return withTemplateVisitor(context, {
      script: {
        CallExpression(node) {
          if (!checkCallExpressionName(node, "defineEmits")) return;

          const hasTypeArguments = !!(
            node.typeArguments && node.typeArguments.params.length > 0
          );

          if (hasTypeArguments) return;

          const firstArg = node.arguments[0];
          const isArrayArg = firstArg?.type === "ArrayExpression";

          if (isArrayArg && allowStringArray) return;

          context.report({
            node,
            messageId: "issue:no-typed-emits",
          });
        },
      },
    });
  },
});
