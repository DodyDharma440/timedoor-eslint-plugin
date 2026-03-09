import { noDirectApiCallInComponent } from "../rules/no-direct-api-call-in-component";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("no-direct-api-call-in-component", noDirectApiCallInComponent, {
  // ============================================================================
  // VALID TEST CASES
  // Cases that should PASS validation
  // ============================================================================
  valid: [
    // Vue component with no API calls — only uses an imported composable
    {
      code: `
        <script setup lang="ts">
          import { usePosts } from '~/composables/usePosts'
          const { data } = usePosts()
        </script>
      `,
      filename: "PostList.vue",
    },

    // Vue component that calls a repository function — no direct fetch
    {
      code: `
        <script setup lang="ts">
          import { useUserRepository } from '~/repositories/useUserRepository'
          const { getUser } = useUserRepository()
          const user = getUser(1)
        </script>
      `,
      filename: "UserProfile.vue",
    },

    // $fetch inside a composable .ts file — rule does not apply outside .vue
    {
      code: `
        export const usePosts = () => {
          const fetchPosts = async () => {
            const data = await $fetch('/api/posts')
            return data
          }
          return { fetchPosts }
        }
      `,
      filename: "usePosts.ts",
    },

    // ofetch inside a repository module .ts file
    {
      code: `
        import { ofetch } from 'ofetch'
        export const usePostsRepository = () => {
          const getPosts = () => ofetch('/api/posts')
          return { getPosts }
        }
      `,
      filename: "usePostsRepository.ts",
    },

    // useFetch inside a composable .ts file
    {
      code: `
        export const useUserProfile = () => {
          const { data, pending } = useFetch('/api/user/profile')
          return { data, pending }
        }
      `,
      filename: "useUserProfile.ts",
    },

    // useFetch called directly inside <script setup> — useFetch is not forbidden
    {
      code: `
        <script setup lang="ts">
          const { data: posts } = useFetch('/api/posts')
        <\/script>
      `,
      filename: "PostList.vue",
    },

    // Vue component with no script block at all
    {
      code: `<template><div>Hello World</div></template>`,
      filename: "StaticComponent.vue",
    },

    // Vue component that only imports and uses a pre-built composable
    {
      code: `
        <script setup lang="ts">
          import { useAuth } from '~/composables/useAuth'
          const { user, logout } = useAuth()
        </script>
        <template><button @click="logout">{{ user?.name }}</button></template>
      `,
      filename: "NavBar.vue",
    },
  ],

  // ============================================================================
  // INVALID TEST CASES
  // Cases that should FAIL and trigger ESLint errors
  // ============================================================================
  invalid: [
    // $fetch called directly inside <script setup>
    {
      code: `
        <script setup lang="ts">
          const data = await $fetch('/api/posts')
        </script>
      `,
      filename: "PostList.vue",
      errors: [{ messageId: "issue:direct-call" }],
    },

    // ofetch called directly inside <script setup>
    {
      code: `
        <script setup lang="ts">
          import { ofetch } from 'ofetch'
          const data = await ofetch('/api/users')
        </script>
      `,
      filename: "UserList.vue",
      errors: [{ messageId: "issue:direct-call" }],
    },

    // $fetch used inside an event handler defined in the component
    {
      code: `
        <script setup lang="ts">
          const handleSubmit = async () => {
            await $fetch('/api/submit', { method: 'POST', body: { name: 'test' } })
          }
        </script>
      `,
      filename: "ContactForm.vue",
      errors: [{ messageId: "issue:direct-call" }],
    },

    // Multiple direct API calls in the same component
    {
      code: `
        <script setup lang="ts">
          const { data: posts } = useFetch('/api/posts')
          const profile = await $fetch('/api/me')
        </script>
      `,
      filename: "Dashboard.vue",
      errors: [{ messageId: "issue:direct-call" }],
    },

    // $fetch used inside useAsyncData callback — still inside a .vue file
    {
      code: `
        <script setup lang="ts">
          const { data } = useAsyncData('posts', () => $fetch('/api/posts'))
        </script>
      `,
      filename: "PostPage.vue",
      errors: [{ messageId: "issue:direct-call" }],
    },

    // $fetch and ofetch forbidden, useFetch is allowed
    {
      code: `
        <script setup lang="ts">
          import { ofetch } from 'ofetch'
          const a = await $fetch('/api/a')
          const b = await ofetch('/api/b')
          const { data: c } = useFetch('/api/c')
        </script>
      `,
      filename: "MultiCall.vue",
      errors: [
        { messageId: "issue:direct-call" },
        { messageId: "issue:direct-call" },
      ],
    },
  ],
});
