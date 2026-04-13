import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import path from "path";
import fs from "fs";

const findNuxtRoot = (filePath: string) => {
  let currentDir = path.dirname(filePath);
  let iterations = 0;
  const MAX_ITERATIONS = 10;

  while (
    currentDir !== path.parse(currentDir).root &&
    iterations < MAX_ITERATIONS
  ) {
    const hasNuxtConfig =
      fs.existsSync(path.join(currentDir, "nuxt.config.ts")) ||
      fs.existsSync(path.join(currentDir, "nuxt.config.js")) ||
      fs.existsSync(path.join(currentDir, "nuxt.config.mjs"));

    if (hasNuxtConfig) {
      return currentDir;
    }

    const pkgPath = path.join(currentDir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        const hasNuxt =
          pkg.dependencies?.nuxt ||
          pkg.devDependencies?.nuxt ||
          pkg.peerDependencies?.nuxt;

        if (hasNuxt) {
          return currentDir;
        }
      } catch {
        // Ignore parse error, continue searching
      }
    }

    currentDir = path.dirname(currentDir);
    iterations++;
  }

  return null;
};

export const getRelativePath = <
  M extends string,
  O extends readonly unknown[],
  C extends RuleContext<M, O>,
>(
  context: C,
) => {
  const fullFilePath = context.physicalFilename || context.filename;
  const nuxtRoot = findNuxtRoot(fullFilePath);

  if (nuxtRoot) {
    const relativeFilePath = path.relative(nuxtRoot, fullFilePath);
    return relativeFilePath.replace(/\\/g, "/");
  }

  const cwd = context.cwd;
  const relativeFilePath = path.relative(cwd, fullFilePath);
  return relativeFilePath;
};

export const isVueFile = (filePath: string) => {
  return filePath.endsWith(".vue");
};

export const getFileName = (filePath: string) => {
  const splittedPath = filePath.split("/");
  return splittedPath[splittedPath.length - 1];
};
