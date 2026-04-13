import { getRelativePath } from "../utils/filename";
import { capitalize } from "../utils/formattter";
import { createRule, withTemplateVisitor } from "../utils/rule";

const whitelistNuxtDirs = ["layouts", "pages"];
const whitelistNuxtFiles = ["app.vue", "error.vue"];

const validateFilename = (
  fileName: string,
  affix: string,
  type: "prefix" | "suffix",
) => {
  let regex;
  if (type === "prefix") {
    regex = new RegExp(`^${affix}[A-Z][a-zA-Z]*\.vue$`);
  } else {
    regex = new RegExp(`^[A-Z][a-zA-Z]*${affix}\.vue$`);
  }
  return regex.test(fileName);
};

type PrefixDirectory = "ui" | "layout";

type ValidateOptions = {
  subPath: string;
  affix: string;
  type: "prefix" | "suffix";
  prefixDirectory: PrefixDirectory;
};

type MessageIds = keyof typeof enforceComponentDirectoryStructure.meta.messages;

const messagesMap: Record<
  PrefixDirectory,
  Record<"inside" | "outside", MessageIds>
> = {
  ui: {
    inside: "issue:component-ui-dir",
    outside: "issue:component-dir-ui",
  },
  layout: {
    inside: "issue:component-layout-dir",
    outside: "issue:component-layout-dir",
  },
};

const validateDirectory = ({
  subPath,
  affix,
  type,
  prefixDirectory,
}: ValidateOptions): MessageIds | null => {
  const splittedSubPath = subPath.split("/");
  const messageIds = messagesMap[prefixDirectory];

  if (splittedSubPath.length <= 2) {
    if (validateFilename(splittedSubPath[1], affix, type)) {
      return messageIds.outside;
    }
  }

  const [_, componentDir, ...files] = subPath.split("/");
  const componentFile = files.filter((f) => f.endsWith(".vue"));

  if (!componentFile[0]) {
    return null;
  }

  const hasFileAffix = validateFilename(componentFile[0], affix, type);
  const hasDirectory = componentDir === prefixDirectory;

  if (!hasDirectory && hasFileAffix) {
    return messageIds.outside;
  }

  if (hasDirectory && !hasFileAffix) {
    return messageIds.inside;
  }

  return null;
};

const getAllowedDirs = (dirs: string[], overrideDefaults: boolean) => {
  const defaultDirs = ["ui", "layout", "section"];

  if (overrideDefaults) {
    return dirs;
  }

  return [...defaultDirs, ...dirs];
};

export const enforceComponentDirectoryStructure = createRule({
  name: "enforce-component-directory-structure",
  meta: {
    docs: {
      description:
        "Validate that components convention name are placed in the correct directory structure",
    },
    type: "layout",
    messages: {
      "issue:component-ui-dir": `Filename must be start with "Ui" when the component is placed in a "components/ui" directory.`,
      "issue:component-dir-ui": `Filename must be placed in a "components/ui" directory when the filename starts with "Ui".`,
      "issue:component-layout-dir": `Filename must be start with "{{parentName}}" when the component is placed in a "components/layout/{{parentDir}}" directory.`,
      "issue:layout-parent-dir": `File must have at least 1 parent directory inside "components/layout" directory.`,
      "issue:invalid-dir":
        "Component must be placed in a valid directory. Allowed directories are: {{allowedDirs}}.",
      "issue:must-components-dir": `Component must be placed inside the "components" directory.`,
    },
    schema: {
      type: "array",
      minItems: 0,
      items: [
        {
          type: "object",
          properties: {
            allowedDirs: { type: "array", items: { type: "string" } },
            overrideDefaults: { type: "boolean" },
          },
          additionalProperties: false,
        },
      ],
    },
    defaultOptions: [
      {
        allowedDirs: [] as string[],
        overrideDefaults: false,
      },
    ],
    hasSuggestions: false,
  },
  create: (context) => {
    const relativePath = getRelativePath(context);

    const isNuxtDir = whitelistNuxtDirs.some((dir) =>
      relativePath.startsWith(`${dir}/`),
    );
    const isNuxtFile = whitelistNuxtFiles.some((file) => relativePath === file);

    if (!relativePath.endsWith(".vue") || isNuxtDir || isNuxtFile) {
      return {};
    }

    const allowedDirs = getAllowedDirs(
      context.options[0]?.allowedDirs || [],
      context.options[0]?.overrideDefaults || false,
    );

    return withTemplateVisitor(context, {
      script: {
        Program: (node) => {
          const componentsDir = `/${relativePath}`.split("/components");

          if (componentsDir.length <= 1) {
            context.report({
              node,
              messageId: "issue:must-components-dir",
            });
            return;
          }

          const subPath = componentsDir[componentsDir.length - 1];

          const messageIdUi = validateDirectory({
            subPath,
            affix: "Ui",
            type: "prefix",
            prefixDirectory: "ui",
          });

          if (messageIdUi) {
            context.report({
              node,
              messageId: messageIdUi,
            });

            return;
          }

          const [_, subCompDir, ...files] = subPath.split("/");
          if (subCompDir === "layout") {
            const parentDir = files[files.length - 2];

            if (!parentDir) {
              context.report({
                node,
                messageId: "issue:layout-parent-dir",
              });

              return;
            }

            const messageIdLayout = validateDirectory({
              subPath,
              affix: capitalize(parentDir, "-"),
              type: "prefix",
              prefixDirectory: "layout",
            });

            if (messageIdLayout) {
              context.report({
                node,
                data: {
                  parentName: capitalize(parentDir, "-"),
                  parentDir,
                },
                messageId: messageIdLayout,
              });

              return;
            }
          }

          const isInAllowedDir = allowedDirs.some((dir) =>
            subPath.startsWith(`/${dir}/`),
          );

          if (!isInAllowedDir) {
            context.report({
              node,
              messageId: "issue:invalid-dir",
              data: {
                allowedDirs: allowedDirs.join(", "),
              },
            });
            return;
          }
        },
      },
    });
  },
});
