import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isVueFile } from "../utils/filename";
import { createRule, withTemplateVisitor } from "../utils/rule";
import { isInsideComposable } from "../utils/ast";

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

          if (!isInsideComposable(ancestors)) {
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
