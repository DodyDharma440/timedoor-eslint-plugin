import { asyncDataTopLevel } from "../rules/async-data-top-level";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("async-data-top-level", asyncDataTopLevel, {
  // ============================================================================
  // VALID TEST CASES
  // Case that should PASS validation
  // ============================================================================
  valid: [
    // useAsyncData at the top level of <script setup>
    {
      code: `
        <script setup lang="ts">
          const { data } = await useAsyncData('posts', () => $fetch('/api/posts'))
        </script>
      `,
      filename: "ValidTopLevelUseAsyncData.vue",
    },
    // useFetch at the top level of <script setup>
    {
      code: `
        <script setup lang="ts">
          const { data } = await useFetch('/api/posts')
        </script>
      `,
      filename: "ValidTopLevelUseFetch.vue",
    },
    // Multiple top-level calls — both are fine
    {
      code: `
        <script setup lang="ts">
          const { data: posts } = await useAsyncData('posts', () => $fetch('/api/posts'))
          const { data: user } = await useFetch('/api/user')
        </script>
      `,
      filename: "ValidMultipleTopLevelCalls.vue",
    },
    // useAsyncData with other top-level statements around it
    {
      code: `
        <script setup lang="ts">
          const title = ref('Hello')
          const { data } = await useAsyncData('item', () => $fetch('/api/item'))
          const count = computed(() => data.value?.length ?? 0)
        </script>
      `,
      filename: "ValidTopLevelWithOtherStatements.vue",
    },
    // Non-tracked composable inside a function — rule ignores it
    {
      code: `
        <script setup lang="ts">
          async function load() {
            const result = await $fetch('/api/posts')
          }
        </script>
      `,
      filename: "ValidNonTrackedComposableInFunction.vue",
    },
    // useRoute inside a function — rule only cares about useAsyncData / useFetch
    {
      code: `
        <script setup lang="ts">
          function getRoute() {
            return useRoute()
          }
        </script>
      `,
      filename: "ValidOtherComposableInFunction.vue",
    },
  ],

  // ============================================================================
  // INVALID TEST CASES
  // Case that should FAIL and trigger ESLint errors
  // ============================================================================
  invalid: [
    // useAsyncData inside an async function
    {
      code: `
        <script setup lang="ts">
          async function loadData() {
            const { data } = await useAsyncData('posts', () => $fetch('/api/posts'))
          }
        </script>
      `,
      filename: "InvalidUseAsyncDataInFunction.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useAsyncData" },
        },
      ],
    },
    // useFetch inside an async function
    {
      code: `
        <script setup lang="ts">
          async function loadUser() {
            const { data } = await useFetch('/api/user')
          }
        </script>
      `,
      filename: "InvalidUseFetchInFunction.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useFetch" },
        },
      ],
    },
    // useAsyncData inside an if block
    {
      code: `
        <script setup lang="ts">
          if (import.meta.client) {
            if (someCondition) {
                const { data } = await useAsyncData('posts', () => $fetch('/api/posts'))
            }
          }
        </script>
      `,
      filename: "InvalidUseAsyncDataInIfBlock.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useAsyncData" },
        },
      ],
    },
    // useFetch inside a try/catch block
    {
      code: `
        <script setup lang="ts">
          try {
            const { data } = await useFetch('/api/posts')
          } catch (e) {}
        </script>
      `,
      filename: "InvalidUseFetchInTryCatch.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useFetch" },
        },
      ],
    },
    // useFetch inside a for loop
    {
      code: `
        <script setup lang="ts">
          for (const id of ids) {
            const { data } = await useFetch(\`/api/item/\${id}\`)
          }
        </script>
      `,
      filename: "InvalidUseFetchInForLoop.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useFetch" },
        },
      ],
    },
    // useAsyncData inside an arrow function
    {
      code: `
        <script setup lang="ts">
          const load = async () => {
            const { data } = await useAsyncData('item', () => $fetch('/api/item'))
          }
        </script>
      `,
      filename: "InvalidUseAsyncDataInArrowFunction.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useAsyncData" },
        },
      ],
    },
    // Both composables used incorrectly in the same block — two errors
    {
      code: `
        <script setup lang="ts">
          async function loadAll() {
            const { data: posts } = await useAsyncData('posts', () => $fetch('/api/posts'))
            const { data: user } = await useFetch('/api/user')
          }
        </script>
      `,
      filename: "InvalidBothComposablesInFunction.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useAsyncData" },
        },
        {
          messageId: "issue:invalid-call",
          data: { name: "useFetch" },
        },
      ],
    },
    // useFetch inside a class method
    {
      code: `
        <script setup lang="ts">
          class DataService {
            async load() {
              const { data } = await useFetch('/api/posts')
            }
          }
        </script>
      `,
      filename: "InvalidUseFetchInClassMethod.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useFetch" },
        },
      ],
    },
  ],
});
