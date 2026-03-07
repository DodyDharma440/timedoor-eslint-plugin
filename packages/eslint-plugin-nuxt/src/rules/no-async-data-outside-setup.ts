import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isVueFile } from "../utils/filename";
import { createRule, withTemplateVisitor } from "../utils/rule";

const COMPOSABLE_REGEX = /^use[A-Z][a-zA-Z0-9]*$/;

export const noAsyncDataOutsideSetup = createRule({
  name: "no-async-data-outside-setup",
  meta: {
    docs: {
      description:
        "Disallow useAsyncData/useFetch outside of Vue component or composable functions.",
    },
    type: "problem",
    messages: {
      "issue:invalid-call":
        "Nuxt composable '{{name}}' cannot be used outside of Vue component or composable function.",
    },
    schema: [],
    defaultOptions: [],
    hasSuggestions: false,
  },
  create: (context) => {
    return withTemplateVisitor(context, {
      script: {
        CallExpression(node) {
          if (isVueFile(context.filename)) return;

          const nuxtFetchComposables = ["useAsyncData", "useFetch"];
          const isCallingNuxtFetchComposable =
            node.callee.type === AST_NODE_TYPES.Identifier &&
            nuxtFetchComposables.includes(node.callee.name);

          if (!isCallingNuxtFetchComposable) return;

          const composableName =
            node.callee.type === AST_NODE_TYPES.Identifier
              ? node.callee.name
              : "";

          const ancestors = context.sourceCode.getAncestors(node);

          const insideComposable = ancestors.some((ancestor, index) => {
            if (
              ancestor.type === AST_NODE_TYPES.FunctionDeclaration &&
              ancestor.id &&
              COMPOSABLE_REGEX.test(ancestor.id.name)
            ) {
              return true;
            }

            if (
              ancestor.type === AST_NODE_TYPES.FunctionExpression ||
              ancestor.type === AST_NODE_TYPES.ArrowFunctionExpression
            ) {
              if (
                ancestor.type === AST_NODE_TYPES.FunctionExpression &&
                ancestor.id &&
                COMPOSABLE_REGEX.test(ancestor.id.name)
              ) {
                return true;
              }

              if (index > 0) {
                const parent = ancestors[index - 1];
                if (
                  parent.type === AST_NODE_TYPES.VariableDeclarator &&
                  parent.id.type === AST_NODE_TYPES.Identifier &&
                  COMPOSABLE_REGEX.test(parent.id.name)
                ) {
                  return true;
                }
              }
            }

            return false;
          });

          if (!insideComposable) {
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
