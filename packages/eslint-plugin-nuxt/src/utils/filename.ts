import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import path from "path";

export const getRelativePath = <C extends RuleContext<any, []>>(context: C) => {
  const fullFilePath = context.filename;
  const cwd = context.cwd;

  const relativeFilePath = path.relative(cwd, fullFilePath);
  return relativeFilePath;
};
