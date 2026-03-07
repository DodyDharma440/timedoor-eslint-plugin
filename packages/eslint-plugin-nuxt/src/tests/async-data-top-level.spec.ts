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
    // useAsyncData inside a named composable function inside <script setup>
    {
      code: `
        <script setup lang="ts">
          function usePosts() {
            return useAsyncData('posts', () => $fetch('/api/posts'))
          }
          const { data } = await usePosts()
        </script>
      `,
      filename: "ValidUseAsyncDataInComposable.vue",
    },
    // useFetch inside a composable arrow assigned inside <script setup>
    {
      code: `
        <script setup lang="ts">
          const useUser = () => {
            return useFetch('/api/user')
          }
          const { data } = await useUser()
        </script>
      `,
      filename: "ValidUseFetchInComposableArrow.vue",
    },
    // useAsyncData inside a composable with dynamic key and watch option
    {
      code: `
        <script setup lang="ts">
          const id = ref(1)
          function usePostById() {
            return useAsyncData(
              () => \`post-\${id.value}\`,
              () => $fetch(\`/api/posts/\${id.value}\`),
              { watch: [id] }
            )
          }
          const { data } = await usePostById()
        </script>
      `,
      filename: "ValidUseAsyncDataWithOptions.vue",
    },
    // Both composables used inside a composable function inside <script setup>
    {
      code: `
        <script setup lang="ts">
          function useDashboard() {
            const posts = useAsyncData('posts', () => $fetch('/api/posts'))
            const user = useFetch('/api/user')
            return { posts, user }
          }
          const { posts, user } = useDashboard()
        </script>
      `,
      filename: "ValidBothInComposable.vue",
    },
    // useFetch inside a nested function within a composable inside <script setup>
    {
      code: `
        <script setup lang="ts">
          function usePageData() {
            async function loadInner() {
              return useFetch('/api/inner')
            }
            return loadInner()
          }
          const { data } = await usePageData()
        </script>
      `,
      filename: "ValidNestedInComposable.vue",
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
    // useAsyncData inside a while loop
    {
      code: `
        <script setup lang="ts">
          while (retries > 0) {
            const { data } = await useAsyncData('retry', () => $fetch('/api/data'))
            retries--
          }
        </script>
      `,
      filename: "InvalidUseAsyncDataInWhileLoop.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useAsyncData" },
        },
      ],
    },
    // useFetch inside a switch statement
    {
      code: `
        <script setup lang="ts">
          switch (mode) {
            case 'user':
              const { data } = await useFetch('/api/user')
              break
          }
        </script>
      `,
      filename: "InvalidUseFetchInSwitch.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useFetch" },
        },
      ],
    },
    // useAsyncData inside a for-of loop
    {
      code: `
        <script setup lang="ts">
          for (const key of keys) {
            const { data } = await useAsyncData(key, () => $fetch(\`/api/\${key}\`))
          }
        </script>
      `,
      filename: "InvalidUseAsyncDataInForOf.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useAsyncData" },
        },
      ],
    },
    // useFetch inside a non-composable arrow (not use*) inside <script setup>
    {
      code: `
        <script setup lang="ts">
          const loadUser = async () => {
            const { data } = await useFetch('/api/user')
          }
        </script>
      `,
      filename: "InvalidUseFetchInNonComposableArrow.vue",
      errors: [
        {
          messageId: "issue:invalid-call",
          data: { name: "useFetch" },
        },
      ],
    },
  ],
});
