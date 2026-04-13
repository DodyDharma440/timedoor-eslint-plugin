import { ESLint, Linter } from "eslint";
import { rules } from "./rules";
import recommended from "./configs/recommended";
import trial from "./configs/trial";

type Plugin = Omit<ESLint.Plugin, "configs"> & {
  configs: ESLint.Plugin["configs"] &
    Record<"recommended" | "trial", Linter.Config>;
};

const plugin: Plugin = {
  meta: {
    name: "eslint-plugin-tmdr-nuxt",
    version: "1.0.0",
  },
  rules,
  configs: {
    recommended,
    trial,
  },
};

export = plugin;
