import { createRule, withTemplateVisitor } from "../utils/rule";

const NON_TOP_LEVEL_ANCESTORS = new Set([
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunctionExpression",
  "ClassDeclaration",
  "ClassExpression",
  "IfStatement",
  "ForStatement",
  "ForInStatement",
  "ForOfStatement",
  "WhileStatement",
  "DoWhileStatement",
  "TryStatement",
  "SwitchStatement",
]);

export const asyncDataTopLevel = createRule({
  name: "async-data-top-level",
  meta: {
    docs: {
      description:
        "Enforce useAsyncData to be called at the top level of setup.",
    },
    type: "problem",
    messages: {
      "issue:invalid-call":
        "'{{name}}' must be called at the top level of <script setup>.",
    },
    schema: [],
    defaultOptions: [],
    hasSuggestions: false,
  },
  create: (context) => {
    return withTemplateVisitor(context, {
      script: {
        CallExpression(node) {
          const nuxtFetchComposables = ["useAsyncData", "useFetch"];
          const isCallingUseAsyncData =
            node.callee.type === "Identifier" &&
            nuxtFetchComposables.includes(node.callee.name);

          if (!isCallingUseAsyncData) return;

          const composableName =
            node.callee.type === "Identifier" ? node.callee.name : "";

          const ancestors = context.sourceCode.getAncestors(node);
          const isTopLevel = !ancestors.some((ancestor) =>
            NON_TOP_LEVEL_ANCESTORS.has(ancestor.type),
          );

          if (!isTopLevel) {
            context.report({
              node,
              messageId: "issue:invalid-call",
              data: { name: composableName },
            });
          }
        },
      },
    });
  },
});
