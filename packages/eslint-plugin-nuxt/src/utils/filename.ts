import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import path from "path";

export const getRelativePath = <
  M extends string,
  O extends readonly unknown[],
  C extends RuleContext<M, O>,
>(
  context: C,
) => {
  const fullFilePath = context.filename;
  const cwd = context.cwd;

  const relativeFilePath = path.relative(cwd, fullFilePath);
  return relativeFilePath;
};

export const isVueFile = (filePath: string) => {
  return filePath.endsWith(".vue");
};
