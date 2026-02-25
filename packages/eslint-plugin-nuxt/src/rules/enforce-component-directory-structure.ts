import { getRelativePath } from "../utils/filename";
import { capitalize } from "../utils/formattter";
import { createRule, withTemplateVisitor } from "../utils/rule";

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
  checkOutside: boolean;
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

export const enforceComponentDirectoryStructure = createRule({
  name: "enforce-component-directory-structure",
  meta: {
    docs: {
      description:
        "Validate that components convention name are placed in the correct directory structure",
    },
    type: "suggestion",
    messages: {
      "issue:component-ui-dir": `Filename must be start with "Ui" when the component is placed in a "components/ui" directory.`,
      "issue:component-dir-ui": `Filename must be placed in a "components/ui" directory when the filename starts with "Ui".`,
      "issue:component-layout-dir": `Filename must be start with "{{parentName}}" when the component is placed in a "components/layout/{{parentDir}}" directory.`,
    },
    schema: [],
    hasSuggestions: false,
  },
  defaultOptions: [],
  create: (context) => {
    const relativePath = getRelativePath(context);

    if (!relativePath.endsWith(".vue")) {
      return {};
    }

    return withTemplateVisitor(context, {
      script: {
        Program: (node) => {
          const componentsDir = `/${relativePath}`.split("/components");
          const subPath = componentsDir[componentsDir.length - 1];

          const messageIdUi = validateDirectory({
            subPath,
            affix: "Ui",
            type: "prefix",
            prefixDirectory: "ui",
            checkOutside: true,
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
            const messageIdLayout = validateDirectory({
              subPath,
              affix: capitalize(parentDir, "-"),
              type: "prefix",
              prefixDirectory: "layout",
              checkOutside: false,
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
        },
      },
    });
  },
});
