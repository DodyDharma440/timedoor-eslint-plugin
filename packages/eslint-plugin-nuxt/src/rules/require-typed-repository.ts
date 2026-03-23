import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { minimatch } from "minimatch";
import { createRule, withTemplateVisitor } from "../utils/rule";
import { getRelativePath } from "../utils/filename";

const DEFAULT_DIRS = ["**/repository/modules/**", "**/repositories/modules/**"];

const matchesPattern = (filepath: string, pattern: string): boolean => {
  const normalizedPath = filepath.replace(/\\/g, "/");
  const normalizedPattern = pattern.replace(/\\/g, "/");

  return minimatch(normalizedPath, normalizedPattern, { dot: true });
};

const getMethodName = (ancestors: TSESTree.Node[]) => {
  const methodDef = ancestors.find((a) => {
    if (a.type === AST_NODE_TYPES.PropertyDefinition) {
      return (
        a.value?.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        a.value?.type === AST_NODE_TYPES.FunctionExpression
      );
    }

    return a.type === AST_NODE_TYPES.MethodDefinition;
  }) as TSESTree.MethodDefinition | TSESTree.PropertyDefinition | undefined;

  if (methodDef?.key?.type === AST_NODE_TYPES.Identifier) {
    return {
      name: methodDef.key.name,
      type:
        methodDef.type === AST_NODE_TYPES.PropertyDefinition
          ? "property function"
          : "method",
    };
  }

  return {
    name: "",
    type: "",
  };
};

export const requireTypedRepository = createRule({
  name: "require-typed-repository",
  meta: {
    docs: {
      description: "Enforce method param and return types in repository layer.",
    },
    type: "problem",
    messages: {
      "issue:no-return":
        "Repository {{classAttr}} '{{methodName}}' must return a typed Generic Promise.",
      "issue:no-param":
        "Repository {{classAttr}} '{{methodName}}' param must be typed.",
      "issue:no-any-return":
        "Do not use any for repository {{classAttr}} return type. Use specific type instead.",
      "issue:no-any-param":
        "Do not use any for repository {{classAttr}} parameters. Use specific type instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          targetDirectory: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        targetDirectory: DEFAULT_DIRS,
      },
    ],
    hasSuggestions: false,
  },
  create: (context) => {
    const options = context.options[0] || {};
    const targetDirectories = options.targetDirectory || DEFAULT_DIRS;

    const relativePath = getRelativePath(context);
    const isTargetFile = targetDirectories.some((pattern) =>
      matchesPattern(relativePath, pattern),
    );

    if (!isTargetFile) {
      return {};
    }

    const handleNoParam = (
      node: TSESTree.Identifier | TSESTree.RestElement,
      methodName: string,
      methodType: string,
    ) => {
      if (!node.typeAnnotation) {
        context.report({
          node,
          messageId: "issue:no-param",
          data: { methodName, classAttr: methodType },
        });
      }

      if (
        node.typeAnnotation?.typeAnnotation.type ===
          AST_NODE_TYPES.TSAnyKeyword ||
        (node.typeAnnotation?.typeAnnotation.type ===
          AST_NODE_TYPES.TSArrayType &&
          node.typeAnnotation?.typeAnnotation.elementType.type ===
            AST_NODE_TYPES.TSAnyKeyword)
      ) {
        context.report({
          node,
          messageId: "issue:no-any-param",
          data: { classAttr: methodType },
        });
      }
    };

    const handleReturnType = <
      T extends TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
    >(
      node: T,
    ) => {
      const ancestors = context.sourceCode.getAncestors(node);
      const isMethod = ancestors.some((a) =>
        [
          AST_NODE_TYPES.ClassDeclaration,
          AST_NODE_TYPES.ClassBody,
          AST_NODE_TYPES.MethodDefinition,
          AST_NODE_TYPES.PropertyDefinition,
        ].includes(a.type),
      );

      if (isMethod) {
        const methodName = getMethodName(ancestors);

        if (!node.returnType) {
          context.report({
            node,
            messageId: "issue:no-return",
            data: { methodName: methodName.name, classAttr: methodName.type },
          });
        }

        if (
          [AST_NODE_TYPES.TSAnyKeyword, AST_NODE_TYPES.TSVoidKeyword].includes(
            node.returnType?.typeAnnotation.type!,
          )
        ) {
          context.report({
            node,
            messageId: "issue:no-any-return",
            data: { classAttr: methodName.type },
          });
        }

        if (
          node.returnType?.typeAnnotation.type ===
            AST_NODE_TYPES.TSTypeReference &&
          node.returnType?.typeAnnotation.typeName.type ===
            AST_NODE_TYPES.Identifier &&
          node.returnType?.typeAnnotation.typeName.name === "Promise"
        ) {
          if (
            [
              AST_NODE_TYPES.TSAnyKeyword,
              AST_NODE_TYPES.TSVoidKeyword,
            ].includes(
              node.returnType?.typeAnnotation.typeArguments?.params[0]?.type!,
            )
          ) {
            context.report({
              node,
              messageId: "issue:no-any-return",
              data: { classAttr: methodName.type },
            });
          }
        }
      }
    };

    return withTemplateVisitor(context, {
      script: {
        Identifier(node) {
          const ancestors = context.sourceCode.getAncestors(node);

          const isRest = ancestors.some(
            (a) => a.type === AST_NODE_TYPES.RestElement,
          );

          if (isRest) return;

          const matchedFunctionExpression = ancestors.find(
            (a) =>
              a.type === AST_NODE_TYPES.FunctionExpression ||
              a.type === AST_NODE_TYPES.ArrowFunctionExpression,
          );
          const isMethodParams = matchedFunctionExpression?.params.find((p) => {
            const isRest = p.type === AST_NODE_TYPES.RestElement;

            if (isRest) {
              return (
                JSON.stringify(p.argument.range) === JSON.stringify(node.range)
              );
            }

            return JSON.stringify(p.range) === JSON.stringify(node.range);
          });
          const methodName = getMethodName(ancestors);

          if (isMethodParams) {
            handleNoParam(node, methodName.name, methodName.type);
          }
        },
        RestElement(node) {
          const ancestors = context.sourceCode.getAncestors(node);
          const methodName = getMethodName(ancestors);
          handleNoParam(node, methodName.name, methodName.type);
        },
        FunctionExpression(node) {
          handleReturnType(node);
        },
        ArrowFunctionExpression(node) {
          handleReturnType(node);
        },
      },
    });
  },
});
