import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export const checkCallExpressionName = (
  node: TSESTree.CallExpression,
  name: string,
) => {
  return (
    node.callee.type === AST_NODE_TYPES.Identifier && node.callee.name === name
  );
};

const COMPOSABLE_REGEX = /^use[A-Z][a-zA-Z0-9]*$/;

export const isInsideComposable = (ancestors: TSESTree.Node[]) => {
  return ancestors.some((ancestor, index) => {
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
};
