import { requirePiniaCompositionApi } from "../rules/require-pinia-composition-api";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("require-pinia-composition-api", requirePiniaCompositionApi, {
  // ============================================================================
  // VALID TEST CASES
  // Case that should PASS validation
  // ============================================================================
  valid: [
    {
      // Composition API style (should pass)
      code: `
        import { defineStore } from 'pinia';
        export const useStore = defineStore('main', () => {
          const count = ref(0);
          return { count };
        });
      `,
      filename: "store.ts",
    },
    {
      // defineStore with function as second argument (should pass)
      code: `
        const useStore = defineStore('main', function() {
          return {};
        });
      `,
      filename: "store.js",
    },
    {
      // defineStore with variable as second argument (should pass)
      code: `
        const storeDef = () => ({});
        const useStore = defineStore('main', storeDef);
      `,
      filename: "store.js",
    },
    {
      // defineStore with only one argument (should pass)
      code: `
        const useStore = defineStore({
          state: () => ({}),
        });
      `,
      filename: "store.js",
    },
    {
      // defineStore with three arguments, second is function (should pass)
      code: `
        const useStore = defineStore('main', () => ({}), { persist: true });
      `,
      filename: "store.js",
    },
  ],

  // ============================================================================
  // INVALID TEST CASES
  // Case that should FAIL and trigger ESLint errors
  // ============================================================================
  invalid: [
    {
      // Options API style as second argument (should fail)
      code: `
        import { defineStore } from 'pinia';
        export const useStore = defineStore('main', {
          state: () => ({ count: 0 }),
          actions: {
            increment() { this.count++ }
          }
        });
      `,
      filename: "store.ts",
      errors: [
        {
          messageId: "issue:options-api",
        },
      ],
    },
    {
      // defineStore with object literal as second argument (should fail)
      code: `
        const useStore = defineStore('main', {
          state: () => ({}),
        });
      `,
      filename: "store.js",
      errors: [
        {
          messageId: "issue:options-api",
        },
      ],
    },
    {
      // defineStore with three arguments, second is object literal (should fail)
      code: `
        const useStore = defineStore('main', { state: () => ({}) }, { persist: true });
      `,
      filename: "store.js",
      errors: [
        {
          messageId: "issue:options-api",
        },
      ],
    },
  ],
});
