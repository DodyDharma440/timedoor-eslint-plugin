import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  rulesSidebar: [
    "intro",
    {
      type: "category",
      label: "ESLint Config",
      collapsed: false,
      link: { type: "doc", id: "eslint-config" },
      items: ["eslint-config/flat-config", "eslint-config/classic-config"],
    },
    {
      type: "category",
      label: "Rules",
      collapsed: false,
      items: [
        "rules",
        {
          type: "category",
          label: "Best Practices (Nuxt.js)",
          collapsed: true,
          items: [
            "rules/no-composable-in-class",
            "rules/async-data-top-level",
            "rules/no-async-data-outside-setup",
            "rules/no-direct-api-call-in-component",
            "rules/require-pinia-composition-api",
          ],
        },
        {
          type: "category",
          label: "TypeScript",
          collapsed: true,
          items: [
            "rules/require-typescript-interface-props",
            "rules/no-inline-props-definition",
            "rules/no-direct-any-in-props",
            "rules/props-interface-name",
            "rules/require-typed-emits-signature",
            "rules/no-inline-emits-definition",
            "rules/no-direct-any-in-emits",
            "rules/emits-interface-name",
            "rules/require-typed-repository",
          ],
        },
        {
          type: "category",
          label: "Directory Structure",
          collapsed: true,
          items: [
            "rules/enforce-component-directory-structure",
            "rules/no-manual-repository-import",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
