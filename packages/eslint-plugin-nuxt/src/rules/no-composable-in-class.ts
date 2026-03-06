import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule, withTemplateVisitor } from "../utils/rule";

const CLASS_NODES = new Set([
  AST_NODE_TYPES.ClassDeclaration,
  AST_NODE_TYPES.ClassExpression,
]);

export const noComposableInClass = createRule({
  name: "no-composable-in-class",
  meta: {
    docs: {
      description: "",
    },
    type: "problem",
    messages: {
      "issue:composable-call":
        "Nuxt composable '{{name}}' cannot be used inside a class method.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowedComposables: { type: "array", items: { type: "string" } },
          overrideDefaults: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        allowedComposables: ["useCookie", "useNuxtApp"],
        overrideDefaults: false,
      },
    ],
    hasSuggestions: false,
  },
  create: (context) => {
    return withTemplateVisitor(context, {
      script: {
        CallExpression(node) {
          const compRegex = /^use[A-Z][a-zA-Z0-9]*$/;
          const isCallingComposable =
            node.callee.type === "Identifier" &&
            compRegex.test(node.callee.name);

          if (!isCallingComposable) return;

          const composableName =
            node.callee.type === "Identifier" ? node.callee.name : "";

          const { allowedComposables = [], overrideDefaults = false } =
            context.options[0] || {};

          const defaultAllowedComposables = ["useCookie", "useNuxtApp"];
          const effectiveAllowedComposables = overrideDefaults
            ? allowedComposables
            : [...defaultAllowedComposables, ...allowedComposables];

          if (effectiveAllowedComposables.includes(composableName)) return;

          const ancestors = context.sourceCode.getAncestors(node);
          const isInsideClass = ancestors.some((ancestor) =>
            CLASS_NODES.has(ancestor.type as AST_NODE_TYPES),
          );

          if (isInsideClass) {
            context.report({
              node,
              messageId: "issue:composable-call",
              data: { name: composableName },
            });
          }
        },
      },
    });
  },
});
