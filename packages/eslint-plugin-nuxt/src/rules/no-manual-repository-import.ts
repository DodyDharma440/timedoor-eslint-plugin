import { getRelativePath } from "../utils/filename";
import {
  createRule,
  mergeOptionWithDefaults,
  withTemplateVisitor,
} from "../utils/rule";

const DEFAULT_FORBIDDEN_PATHS = [
  "repository/modules",
  "repositories/modules",
  "repository/module",
  "repositories/module",
];

const DEFAULT_ALLOWED_DIRS = ["plugins"];

export const noManualRepositoryImport = createRule({
  name: "no-manual-repository-import",
  meta: {
    docs: {
      description: "Disallow manual repository imports in Vue components.",
    },
    type: "problem",
    messages: {
      "issue:manual-import":
        "Manual repository import detected. Use the repository module from global Nuxt plugin instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          forbiddenPaths: { type: "array", items: { type: "string" } },
          overrideDefaults: { type: "boolean" },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        properties: {
          allowedDirsToImport: { type: "array", items: { type: "string" } },
          overrideDefaults: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      { forbiddenPaths: DEFAULT_FORBIDDEN_PATHS, overrideDefaults: false },
      { allowedDirsToImport: DEFAULT_ALLOWED_DIRS, overrideDefaults: false },
    ],
    hasSuggestions: false,
  },
  create: (context) => {
    return withTemplateVisitor(context, {
      script: {
        ImportDeclaration(node) {
          const forbiddenPaths = mergeOptionWithDefaults({
            options:
              context.options[0].forbiddenPaths ?? DEFAULT_FORBIDDEN_PATHS,
            defaultOptions: DEFAULT_FORBIDDEN_PATHS,
            overrideDefaults: context.options[0].overrideDefaults,
          });
          const allowedImportDirs = mergeOptionWithDefaults({
            options:
              context.options[1].allowedDirsToImport ?? DEFAULT_ALLOWED_DIRS,
            defaultOptions: DEFAULT_ALLOWED_DIRS,
            overrideDefaults: context.options[1].overrideDefaults,
          });

          const importSource = node.source.value;

          const relativePath = getRelativePath(context);
          const allowedRegex = new RegExp(
            `(^|\/)(${allowedImportDirs.join("|")})(\/|$)`,
          );
          if (allowedRegex.test(relativePath)) {
            return;
          }

          const forbiddenRegex = new RegExp(
            `(^|\/)(${forbiddenPaths.join("|")})(\/|$)`,
          );
          console.log("🚀 ~ forbiddenRegex:", forbiddenRegex);

          if (forbiddenRegex.test(importSource)) {
            context.report({
              node,
              messageId: "issue:manual-import",
            });
          }
        },
      },
    });
  },
});
