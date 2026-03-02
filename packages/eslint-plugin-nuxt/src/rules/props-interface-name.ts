import { checkCallExpressionName } from "../utils/ast";
import { createRule, withTemplateVisitor } from "../utils/rule";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { getFileName } from "../utils/filename";
import { capitalize } from "../utils/formattter";
import type { TSESTree } from "@typescript-eslint/utils";

function findInterfaceDeclaration(
  ast: TSESTree.Program,
  interfaceName: string,
) {
  for (const node of ast.body) {
    if (
      node.type === AST_NODE_TYPES.TSInterfaceDeclaration &&
      node.id.type === AST_NODE_TYPES.Identifier &&
      node.id.name === interfaceName
    ) {
      return node;
    }
  }
  return null;
}

export const propsInterfaceName = createRule({
  name: "props-interface-name",
  meta: {
    type: "layout",
    docs: {
      description: "Enforce naming convention for props interface",
    },
    fixable: "code",
    hasSuggestions: true,
    messages: {
      "issue:invalid-interface-name":
        "Props interface name '{{currentName}}' does not match expected pattern '{{expectedPattern}}'.",
      "hint:rename-interface":
        "Suggestion: Rename interface to '{{expectedName}}' to match filename.",
    },
    schema: [
      {
        type: "object",
        properties: {
          pattern: {
            type: "string",
            description: "Regex pattern (use {{FileName}} as placeholder)",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ pattern: "^{{FileName}}Props$" }],
  },
  create: (context) => {
    const options = context.options[0] || {};
    const rawPattern = options.pattern || "^{{FileName}}Props$";

    const fileName = getFileName(context.filename);
    const formattedFileName = capitalize(fileName, "-").replace(/\.\w+$/, "");

    const expectedInterfaceName = rawPattern
      .replace("{{FileName}}", formattedFileName)
      .replace(/^\^/, "")
      .replace(/\$$/, "");

    const patternRegex = new RegExp(
      rawPattern.replace("{{FileName}}", formattedFileName),
    );

    return withTemplateVisitor(context, {
      script: {
        CallExpression(node) {
          if (!checkCallExpressionName(node, "defineProps")) {
            return;
          }

          if (!node.typeArguments || node.typeArguments.params.length === 0) {
            return;
          }

          const typeParam = node.typeArguments.params[0];

          if (
            typeParam.type === AST_NODE_TYPES.TSTypeReference &&
            typeParam.typeName.type === AST_NODE_TYPES.Identifier
          ) {
            const typeNameNode = typeParam.typeName;
            const currentName = typeNameNode.name;

            if (!patternRegex.test(currentName)) {
              const sourceCode = context.sourceCode;
              const interfaceNode = findInterfaceDeclaration(
                sourceCode.ast,
                currentName,
              );
              const isImported = !interfaceNode;

              context.report({
                node: typeNameNode,
                messageId: "issue:invalid-interface-name",
                data: {
                  currentName,
                  expectedPattern: rawPattern.replace(
                    "{{FileName}}",
                    formattedFileName,
                  ),
                  expectedName: expectedInterfaceName,
                },
                fix: isImported
                  ? null
                  : (fixer) => {
                      const fixes = [];
                      fixes.push(
                        fixer.replaceText(typeNameNode, expectedInterfaceName),
                      );
                      if (interfaceNode) {
                        fixes.push(
                          fixer.replaceText(
                            interfaceNode.id,
                            expectedInterfaceName,
                          ),
                        );
                      }
                      return fixes;
                    },
                suggest: [
                  {
                    messageId: "hint:rename-interface",
                    data: { expectedName: expectedInterfaceName },
                    fix: (fixer) => {
                      const fixes = [];
                      fixes.push(
                        fixer.replaceText(typeNameNode, expectedInterfaceName),
                      );
                      if (interfaceNode) {
                        fixes.push(
                          fixer.replaceText(
                            interfaceNode.id,
                            expectedInterfaceName,
                          ),
                        );
                      }
                      return fixes;
                    },
                  },
                ],
              });
            }
          }
        },
      },
    });
  },
});
