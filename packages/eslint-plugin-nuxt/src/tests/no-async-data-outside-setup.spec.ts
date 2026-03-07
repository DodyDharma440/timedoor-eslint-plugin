import { noAsyncDataOutsideSetup } from "../rules/no-async-data-outside-setup";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("no-async-data-outside-setup", noAsyncDataOutsideSetup, {
  // ============================================================================
  // VALID TEST CASES
  // Cases that should PASS validation
  // ============================================================================
  valid: [
    // .vue file — rule is skipped entirely for Vue components
    {
      code: `
        <script setup lang="ts">
          function fetchData() {
            useAsyncData('posts', () => $fetch('/api/posts'))
          }
        </script>
      `,
      filename: "SomeComponent.vue",
    },
    // Named function declaration whose name matches composable pattern
    {
      code: `
        export function usePosts() {
          const { data } = useAsyncData('posts', () => $fetch('/api/posts'))
          return { data }
        }
      `,
      filename: "usePosts.ts",
    },
    // Arrow function assigned to a composable-named variable
    {
      code: `
        export const useUser = () => {
          const { data } = useFetch('/api/user')
          return { data }
        }
      `,
      filename: "useUser.ts",
    },
    // Async arrow function assigned to a composable-named variable
    {
      code: `
        export const useItems = async () => {
          const { data } = useAsyncData('items', () => $fetch('/api/items'))
          return { data }
        }
      `,
      filename: "useItems.ts",
    },
    // Anonymous async function expression assigned to a composable-named variable
    {
      code: `
        export const useOrders = async function() {
          const { data } = useFetch('/api/orders')
          return { data }
        }
      `,
      filename: "useOrders.ts",
    },
    // Named function expression whose own name matches composable pattern
    {
      code: `
        export const useProducts = function useProductsImpl() {
          const { data } = useAsyncData('products', () => $fetch('/api/products'))
          return { data }
        }
      `,
      filename: "useProducts.ts",
    },
    // Call nested inside a helper function that is inside a composable
    {
      code: `
        export function useNested() {
          async function loadData() {
            const { data } = await useAsyncData('nested', () => $fetch('/api/nested'))
            return data
          }
          return { loadData }
        }
      `,
      filename: "useNested.ts",
    },
    // useFetch inside a composable — different composable name variety
    {
      code: `
        export const useMyDashboard = () => {
          const { data: stats } = useFetch('/api/stats')
          const { data: alerts } = useFetch('/api/alerts')
          return { stats, alerts }
        }
      `,
      filename: "useMyDashboard.ts",
    },
  ],

  // ============================================================================
  // INVALID TEST CASES
  // Cases that should FAIL and trigger ESLint errors
  // ============================================================================
  invalid: [
    // useAsyncData called at module top level
    {
      code: `
        const { data } = useAsyncData('posts', () => $fetch('/api/posts'))
      `,
      filename: "topLevel.ts",
      errors: [
        { messageId: "issue:invalid-call", data: { name: "useAsyncData" } },
      ],
    },
    // useFetch called at module top level
    {
      code: `
        const { data } = useFetch('/api/posts')
      `,
      filename: "topLevel.ts",
      errors: [{ messageId: "issue:invalid-call", data: { name: "useFetch" } }],
    },
    // useAsyncData inside a non-composable named function declaration
    {
      code: `
        export function fetchPosts() {
          const { data } = useAsyncData('posts', () => $fetch('/api/posts'))
          return data
        }
      `,
      filename: "fetchPosts.ts",
      errors: [
        { messageId: "issue:invalid-call", data: { name: "useAsyncData" } },
      ],
    },
    // useFetch inside an arrow function with a non-composable variable name
    {
      code: `
        const loadUser = () => {
          const { data } = useFetch('/api/user')
          return data
        }
      `,
      filename: "loader.ts",
      errors: [{ messageId: "issue:invalid-call", data: { name: "useFetch" } }],
    },
    // useAsyncData inside a class method
    {
      code: `
        class DataService {
          async fetchData() {
            const { data } = useAsyncData('service', () => $fetch('/api/data'))
            return data
          }
        }
      `,
      filename: "DataService.ts",
      errors: [
        { messageId: "issue:invalid-call", data: { name: "useAsyncData" } },
      ],
    },
    // Multiple violations in one file
    {
      code: `
        export function loadData() {
          useAsyncData('a', () => $fetch('/api/a'))
        }

        export const fetchItems = () => {
          useFetch('/api/items')
        }
      `,
      filename: "multipleViolations.ts",
      errors: [
        { messageId: "issue:invalid-call", data: { name: "useAsyncData" } },
        { messageId: "issue:invalid-call", data: { name: "useFetch" } },
      ],
    },
  ],
});
