import { enforceComponentDirectoryStructure } from "../rules/enforce-component-directory-structure";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run(
  "enforce-component-directory-structure",
  enforceComponentDirectoryStructure,
  {
    // ============================================================================
    // VALID TEST CASES
    // Components that should PASS the directory structure validation
    // ============================================================================
    valid: [
      // --------------------------------------------------------------------------
      // Default Allowed Directories (ui, layout, section)
      // These directories are enabled by default without additional configuration
      // --------------------------------------------------------------------------

      // UI Components: Must start with "Ui" prefix when inside /components/ui/
      {
        code: `<template><div>Hi 1</div></template>`,
        filename: "/components/ui/UiButton.vue",
      },
      {
        code: `<template><div>Hi 2</div></template>`,
        filename: "/components/ui/input/UiInput.vue", // Nested subdirectory is allowed
      },
      {
        code: `<template><div>Hi 3</div></template>`,
        filename: "/components/ui/buttons/UiButton.vue", // Deep nesting in ui/ is valid
      },
      {
        code: `<template><div>Hi 4</div></template>`,
        filename: "/components/ui/inputs/fields/UiTextField.vue", // Multi-level nesting
      },

      // Layout Components: Must start with PascalCase(parentDir) prefix
      // e.g., /components/layout/sidebar/ -> Sidebar*Layout.vue
      {
        code: `<template><div>Hi 5</div></template>`,
        filename: "/components/layout/default/DefaultLayout.vue",
      },
      {
        code: `<template><div>Hi 6</div></template>`,
        filename: "/components/layout/sidebar/SidebarNavigation.vue",
      },
      {
        code: `<template><div>Hi 7</div></template>`,
        filename: "/components/layout/sidebar-nav/SidebarNavLayout.vue", // kebab-case dir -> PascalCase prefix
      },

      // Section Components: No naming convention enforced, just directory validation
      {
        code: `<template><div>Hi 8</div></template>`,
        filename: "/components/section/AnySection.vue",
      },
      {
        code: `<template><div>Hi 9</div></template>`,
        filename: "/components/section/header/HeaderSection.vue",
      },

      // --------------------------------------------------------------------------
      // Custom Allowed Directories (overrideDefaults: false / merge mode)
      // Custom directories are ADDED to the default list [ui, layout, section]
      // --------------------------------------------------------------------------
      {
        code: `<template><div>Hi 10</div></template>`,
        filename: "/components/widgets/WidgetCard.vue",
        options: [{ allowedDirs: ["widgets"], overrideDefaults: false }],
      },
      {
        // Default directories remain valid when merging with custom dirs
        code: `<template><div>Hi 11</div></template>`,
        filename: "/components/ui/UiCard.vue",
        options: [{ allowedDirs: ["widgets"], overrideDefaults: false }],
      },

      // --------------------------------------------------------------------------
      // Custom Allowed Directories (overrideDefaults: true / replace mode)
      // Only specified directories are valid; defaults are DISABLED
      // --------------------------------------------------------------------------
      {
        code: `<template><div>Hi 12</div></template>`,
        filename: "/components/features/FeatureList.vue",
        options: [{ allowedDirs: ["features"], overrideDefaults: true }],
      },
      {
        code: `<template><div>Hi 13</div></template>`,
        filename: "/components/modules/ModuleItem.vue",
        options: [
          { allowedDirs: ["modules", "blocks"], overrideDefaults: true },
        ],
      },

      // --------------------------------------------------------------------------
      // Edge Cases & Exclusions
      // --------------------------------------------------------------------------
      {
        // Non-.vue files are ignored by this rule
        code: `<template><div>Hi 14</div></template>`,
        filename: "/components/ui/UiButton.ts",
      },
      {
        // Template-only components (no <script>) should still be validated
        code: `<template><div>Template Only</div></template>`,
        filename: "/components/ui/UiTemplateOnly.vue",
      },
    ],

    // ============================================================================
    // INVALID TEST CASES
    // Components that should FAIL and trigger ESLint errors
    // ============================================================================
    invalid: [
      // --------------------------------------------------------------------------
      // UI Convention Violations
      // Rule: Files in /components/ui/ MUST start with "Ui" prefix
      // Rule: Files starting with "Ui" MUST be placed in /components/ui/
      // --------------------------------------------------------------------------
      {
        code: `<template><div>Hi 1</div></template>`,
        filename: "/components/ui/Button.vue", // Missing "Ui" prefix
        errors: [{ messageId: "issue:component-ui-dir" }],
      },
      {
        code: `<template><div>Hi 2</div></template>`,
        filename: "/components/common/UiButton.vue", // "Ui" prefix outside ui/ directory
        errors: [{ messageId: "issue:component-dir-ui" }],
      },
      {
        code: `<template><div>Hi 3</div></template>`,
        filename: "/components/UiModal.vue", // "Ui" prefix at root components/
        errors: [{ messageId: "issue:component-dir-ui" }],
      },

      // --------------------------------------------------------------------------
      // Layout Convention Violations
      // Rule: Files in /components/layout/{dir}/ MUST start with PascalCase({dir})
      // --------------------------------------------------------------------------
      {
        code: `<template><div>Hi 4</div></template>`,
        filename: "/components/layout/sidebar/WrongName.vue",
        errors: [
          {
            messageId: "issue:component-layout-dir",
            data: { parentName: "Sidebar", parentDir: "sidebar" },
          },
        ],
      },
      {
        code: `<template><div>Hi 5</div></template>`,
        filename: "/components/layout/admin/adminPanel.vue", // Must be PascalCase: AdminPanel
        errors: [
          {
            messageId: "issue:component-layout-dir",
            data: { parentName: "Admin", parentDir: "admin" },
          },
        ],
      },
      {
        code: `<template><div>Hi 6</div></template>`,
        filename: "/modules/admin/components/layout/admin/Panel.vue",
        errors: [
          {
            messageId: "issue:component-layout-dir",
            data: { parentName: "Admin", parentDir: "admin" },
          },
        ],
      },
      {
        code: `<template><div>Hi 7</div></template>`,
        filename: "/components/layout/user-profile/WrongName.vue", // kebab-case dir test
        errors: [
          {
            messageId: "issue:component-layout-dir",
            data: { parentName: "UserProfile", parentDir: "user-profile" },
          },
        ],
      },
      {
        // Edge case: Layout file placed directly in /layout/ without subdirectory
        code: `<template><div>Hi 8</div></template>`,
        filename: "/components/layout/OrphanLayout.vue",
        errors: [{ messageId: "issue:layout-parent-dir" }],
      },

      // --------------------------------------------------------------------------
      // Invalid Directory Violations
      // Rule: Components must be placed in allowed directories only
      // --------------------------------------------------------------------------
      {
        code: `<template><div>Hi 9</div></template>`,
        filename: "/components/random/RandomComponent.vue",
        errors: [
          {
            messageId: "issue:invalid-dir",
            data: { allowedDirs: "ui, layout, section" },
          },
        ],
      },
      {
        code: `<template><div>Hi 10</div></template>`,
        filename: "/components/RootComponent.vue", // Direct child of components/
        errors: [
          {
            messageId: "issue:invalid-dir",
            data: { allowedDirs: "ui, layout, section" },
          },
        ],
      },

      // --------------------------------------------------------------------------
      // Override Defaults: True (Default directories become INVALID)
      // When overrideDefaults: true, ONLY specified allowedDirs are valid
      // --------------------------------------------------------------------------
      {
        code: `<template><div>Hi 11</div></template>`,
        filename: "/components/ui/UiButton.vue", // ui/ is NOT valid when overridden
        options: [{ allowedDirs: ["widgets"], overrideDefaults: true }],
        errors: [
          {
            messageId: "issue:invalid-dir",
            data: { allowedDirs: "widgets" },
          },
        ],
      },
      {
        code: `<template><div>Hi 12</div></template>`,
        filename: "/components/layout/default/DefaultLayout.vue", // layout/ is NOT valid
        options: [{ allowedDirs: ["widgets"], overrideDefaults: true }],
        errors: [
          {
            messageId: "issue:invalid-dir",
            data: { allowedDirs: "widgets" },
          },
        ],
      },

      // --------------------------------------------------------------------------
      // Custom Options: Directory Not in Allowed List
      // --------------------------------------------------------------------------
      {
        code: `<template><div>Hi 13</div></template>`,
        filename: "/components/legacy/LegacyComponent.vue",
        options: [{ allowedDirs: ["modern", "new"], overrideDefaults: true }],
        errors: [
          {
            messageId: "issue:invalid-dir",
            data: { allowedDirs: "modern, new" },
          },
        ],
      },
    ],
  },
);
