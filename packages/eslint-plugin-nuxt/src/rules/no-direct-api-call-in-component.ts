import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isVueFile } from "../utils/filename";
import { createRule, withTemplateVisitor } from "../utils/rule";

const DIRECT_FETCH_NAMES = ["$fetch", "ofetch", "fetch"];

export const noDirectApiCallInComponent = createRule({
  name: "no-direct-api-call-in-component",
  meta: {
    docs: {
      description: "Disallow direct API fetching logic inside Vue components.",
    },
    type: "suggestion",
    messages: {
      "issue:direct-call":
        "Direct API call detected in component. Use repository pattern instead.",
    },
    schema: [],
    defaultOptions: [],
    hasSuggestions: false,
  },
  create: (context) => {
    return withTemplateVisitor(context, {
      script: {
        CallExpression(node) {
          if (!isVueFile(context.filename)) return;

          const callee = node.callee;
          const isFetchCall =
            callee.type === AST_NODE_TYPES.Identifier &&
            DIRECT_FETCH_NAMES.includes(callee.name);

          if (!isFetchCall) return;

          context.report({
            node,
            messageId: "issue:direct-call",
          });
        },
      },
    });
  },
});
