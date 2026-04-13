import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { TSESTree } from "@typescript-eslint/utils";
import type { RuleFixer } from "@typescript-eslint/utils/ts-eslint";
import { checkCallExpressionName } from "./ast";
import { isVueFile, getFileName } from "./filename";
import { capitalize } from "./formattter";
import { createRule, withTemplateVisitor } from "./rule";

export function findInterfaceDeclaration(
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

interface InterfaceNameRuleConfig {
  macroName: string;
  ruleName: string;
  description: string;
  subjectLabel: string;
  defaultSuffix: string;
}

export function createInterfaceNameRule(config: InterfaceNameRuleConfig) {
  const { macroName, ruleName, description, subjectLabel, defaultSuffix } =
    config;
  const defaultPattern = `^{{FileName}}${defaultSuffix}$`;

  return createRule<
    [{ pattern?: string }],
    "issue:invalid-interface-name" | "hint:rename-interface"
  >({
    name: ruleName,
    meta: {
      type: "layout",
      docs: { description },
      fixable: "code",
      hasSuggestions: true,
      messages: {
        "issue:invalid-interface-name": `${subjectLabel} interface name '{{currentName}}' does not match expected pattern '{{expectedPattern}}'.`,
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
      defaultOptions: [{ pattern: defaultPattern }],
    },
    create: (context) => {
      const options = context.options[0] || {};
      const rawPattern = options.pattern || defaultPattern;

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
            if (!checkCallExpressionName(node, macroName)) {
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

                const buildFixes = (fixer: RuleFixer) => {
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
                };

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
                  fix: isImported ? null : buildFixes,
                  suggest: [
                    {
                      messageId: "hint:rename-interface",
                      data: { expectedName: expectedInterfaceName },
                      fix: buildFixes,
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
}

// ─── Factory: no-direct-any-in-* rules ───────────────────────────────────────

interface NoDirectAnyRuleConfig<TMessageId extends string> {
  macroName: string;
  ruleName: string;
  description: string;
  messageId: TMessageId;
  messageText: string;
}

export function createNoDirectAnyRule<TMessageId extends string>(
  config: NoDirectAnyRuleConfig<TMessageId>,
) {
  return createRule<[{ allowUnknown?: boolean }], TMessageId>({
    name: config.ruleName,
    meta: {
      docs: { description: config.description },
      type: "problem",
      messages: {
        [config.messageId]: config.messageText,
      } as Record<TMessageId, string>,
      schema: [
        {
          type: "object",
          properties: {
            allowUnknown: {
              type: "boolean",
              description: "Allow 'unknown' type. Default is false.",
            },
          },
          additionalProperties: false,
        },
      ],
      defaultOptions: [{ allowUnknown: false }],
      hasSuggestions: false,
    },
    create: (context) => {
      if (!isVueFile(context.filename)) return {};

      const allowUnknown = context.options[0]?.allowUnknown ?? false;

      return withTemplateVisitor(context, {
        script: {
          CallExpression(node) {
            if (checkCallExpressionName(node, config.macroName)) {
              const hasTypeParameter = !!(
                node.typeArguments && node.typeArguments.params.length > 0
              );

              if (!hasTypeParameter) {
                return;
              }

              const disallowedTypes = [AST_NODE_TYPES.TSAnyKeyword];
              if (!allowUnknown) {
                disallowedTypes.push(AST_NODE_TYPES.TSUnknownKeyword);
              }

              if (
                node.typeArguments &&
                disallowedTypes.includes(node.typeArguments.params[0].type)
              ) {
                context.report({
                  node,
                  messageId: config.messageId,
                });
              }
            }
          },
        },
      });
    },
  });
}

// ─── no-inline-*-definition rules ────────────────────────────────────

interface NoInlineDefinitionRuleConfig<
  TEmptyId extends string,
  TInlineId extends string,
> {
  macroName: string;
  ruleName: string;
  description: string;
  /** The schema / options key for the limit, e.g. "propertiesLimit" or "eventsLimit" */
  limitOptionKey: string;
  defaultLimit: number;
  emptyMessageId: TEmptyId;
  emptyMessageText: string;
  inlineMessageId: TInlineId;
  inlineMessageText: string;
}

export function createNoInlineDefinitionRule<
  TEmptyId extends string,
  TInlineId extends string,
>(config: NoInlineDefinitionRuleConfig<TEmptyId, TInlineId>) {
  type MessageIds = TEmptyId | TInlineId;
  type Options = [Record<string, number>];

  return createRule<Options, MessageIds>({
    name: config.ruleName,
    meta: {
      docs: { description: config.description },
      type: "suggestion",
      messages: {
        [config.emptyMessageId]: config.emptyMessageText,
        [config.inlineMessageId]: config.inlineMessageText,
      } as Record<MessageIds, string>,
      schema: {
        type: "array",
        items: [
          {
            type: "object",
            properties: {
              [config.limitOptionKey]: { type: "number" },
            },
          },
        ],
      },
      defaultOptions: [
        { [config.limitOptionKey]: config.defaultLimit } as Record<
          string,
          number
        >,
      ],
      hasSuggestions: false,
    },
    create: (context) => {
      if (!isVueFile(context.filename)) return {};

      return withTemplateVisitor(context, {
        script: {
          CallExpression(node) {
            if (checkCallExpressionName(node, config.macroName)) {
              const hasTypeParameter = !!(
                node.typeArguments && node.typeArguments.params.length > 0
              );

              if (!hasTypeParameter) {
                return;
              }

              if (
                node.typeArguments?.params[0].type ===
                AST_NODE_TYPES.TSTypeLiteral
              ) {
                const memberCount = node.typeArguments.params[0].members.length;
                const limit =
                  (context.options[0] as Record<string, number>)?.[
                    config.limitOptionKey
                  ] ?? config.defaultLimit;

                if (memberCount === 0) {
                  context.report({
                    node,
                    messageId: config.emptyMessageId,
                  });
                  return;
                }

                if (memberCount > limit) {
                  context.report({
                    node,
                    messageId: config.inlineMessageId,
                    data: { limit },
                  });
                }
              }
            }
          },
        },
      });
    },
  });
}
