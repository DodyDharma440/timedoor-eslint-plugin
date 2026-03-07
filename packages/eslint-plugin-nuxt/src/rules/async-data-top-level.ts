import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule, withTemplateVisitor } from "../utils/rule";
import { isInsideComposable } from "../utils/ast";

const NON_TOP_LEVEL_ANCESTORS = new Set([
  AST_NODE_TYPES.FunctionDeclaration,
  AST_NODE_TYPES.FunctionExpression,
  AST_NODE_TYPES.ArrowFunctionExpression,
  AST_NODE_TYPES.ClassDeclaration,
  AST_NODE_TYPES.ClassExpression,
  AST_NODE_TYPES.IfStatement,
  AST_NODE_TYPES.ForStatement,
  AST_NODE_TYPES.ForInStatement,
  AST_NODE_TYPES.ForOfStatement,
  AST_NODE_TYPES.WhileStatement,
  AST_NODE_TYPES.DoWhileStatement,
  AST_NODE_TYPES.TryStatement,
  AST_NODE_TYPES.SwitchStatement,
]);

export const asyncDataTopLevel = createRule({
  name: "async-data-top-level",
  meta: {
    docs: {
      description:
        "Enforce useAsyncData to be called at the top level of setup or inside custom composable.",
    },
    type: "problem",
    messages: {
      "issue:invalid-call":
        "'{{name}}' must be called at the top level of <script setup> or inside custom composable.",
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
            node.callee.type === AST_NODE_TYPES.Identifier &&
            nuxtFetchComposables.includes(node.callee.name);

          if (!isCallingUseAsyncData) return;

          const composableName =
            node.callee.type === AST_NODE_TYPES.Identifier
              ? node.callee.name
              : "";

          const ancestors = context.sourceCode.getAncestors(node);
          const isTopLevel = !ancestors.some((ancestor) =>
            NON_TOP_LEVEL_ANCESTORS.has(ancestor.type),
          );

          if (!isTopLevel && !isInsideComposable(ancestors)) {
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
