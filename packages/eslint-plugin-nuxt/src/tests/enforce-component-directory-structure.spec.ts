import { enforceComponentDirectoryStructure } from "../rules/enforce-component-directory-structure";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run(
  "enforce-component-directory-structure",
  enforceComponentDirectoryStructure,
  {
    valid: [
      {
        code: `<template><div>Hi 1</div></template>`,
        filename: "/components/components/ui/UiButton.vue",
      },
      {
        code: `<template><div>Hi 2</div></template>`,
        filename: "/components/ui/input/UiInput.vue",
      },
      {
        code: `<template><div>Hi 3</div></template>`,
        filename: "/components/layout/default/DefaultLayout.vue",
      },
      {
        code: `<template><div>Hi 4</div></template>`,
        filename: "/components/layout/sidebar/SidebarNavigation.vue",
      },
    ],
    invalid: [
      {
        code: `<template><div>Hi 1</div></template>`,
        filename: "/components/ui/Button.vue",
        errors: [
          {
            messageId: "issue:component-ui-dir",
          },
        ],
      },
      {
        code: `<template><div>Hi 2</div></template>`,
        filename: "/components/common/UiButton.vue",
        errors: [
          {
            messageId: "issue:component-dir-ui",
          },
        ],
      },
      {
        code: `<template><div>Hi 3</div></template>`,
        filename: "/components/UiModal.vue",
        errors: [
          {
            messageId: "issue:component-dir-ui",
          },
        ],
      },
      {
        code: `<template><div>Hi 4</div></template>`,
        filename: "/components/layout/sidebar/WrongName.vue",
        errors: [
          {
            messageId: "issue:component-layout-dir",
          },
        ],
      },
      {
        code: `<template><div>Hi 5</div></template>`,
        filename: "/components/layout/admin/adminPanel.vue", // huruf kecil 'a'
        errors: [
          {
            messageId: "issue:component-layout-dir",
          },
        ],
      },
      {
        code: `<template><div>Hi 6</div></template>`,
        filename: "/modules/admin/components/layout/admin/Panel.vue", // huruf kecil 'a'
        errors: [
          {
            messageId: "issue:component-layout-dir",
          },
        ],
      },
    ],
  },
);
