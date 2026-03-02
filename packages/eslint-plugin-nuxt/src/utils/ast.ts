import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export const checkCallExpressionName = (
  node: TSESTree.CallExpression,
  name: string,
) => {
  return (
    node.callee.type === AST_NODE_TYPES.Identifier && node.callee.name === name
  );
};
