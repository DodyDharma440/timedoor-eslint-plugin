import { noDirectAnyInEmits } from "../rules/no-direct-any-in-emits";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("no-direct-any-in-emits", noDirectAnyInEmits, {
  valid: [
    {
      code: `
        <script setup lang="ts">
          interface Emits {
            (e: 'click'): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "ValidInterfaceEmits.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface Emits {
            (e: 'update', value: string): void
            (e: 'delete', id: number): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "ValidMultipleEventEmits.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface Emits {
            (e: 'change', value: number | string): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "ValidUnionPayloadEmits.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface Emits {
            (e: 'submit', payload: { name: string; age: number }): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "ValidObjectPayloadEmits.vue",
    },
    {
      code: `
        <script setup lang="ts">
          import type { SubmitPayload } from '@/types'
          interface Emits {
            (e: 'submit', payload: SubmitPayload): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "ValidImportedTypeEmits.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits(['click', 'update'])
        </script>
      `,
      filename: "ValidRuntimeDeclaration.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits()
        </script>
      `,
      filename: "ValidEmptyCall.vue",
    },
    {
      code: `
        export function createEmits<T>() {
          return {} as T
        }
      `,
      filename: "ValidNonVueFile.ts",
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<unknown>()
        </script>
      `,
      filename: "ValidUnknownAllowed.vue",
      options: [{ allowUnknown: true }],
    },
    {
      code: `
        <script setup lang="ts">
          interface Emits {
            (e: 'update', items: Array<string>): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "ValidGenericPayloadEmits.vue",
    },
  ],
  invalid: [
    {
      code: `
        <script setup lang="ts">
          defineEmits<any>()
        </script>
      `,
      filename: "InvalidDirectAny.vue",
      errors: [
        {
          messageId: "issue:any-in-emits",
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          const emit = defineEmits<any>()
        </script>
      `,
      filename: "InvalidDirectAnyWithAssignment.vue",
      errors: [
        {
          messageId: "issue:any-in-emits",
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<unknown>()
        </script>
      `,
      filename: "InvalidUnknownDisallowed.vue",
      options: [{ allowUnknown: false }],
      errors: [
        {
          messageId: "issue:any-in-emits",
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          const emit = defineEmits<unknown>()
        </script>
      `,
      filename: "InvalidUnknownDisallowedAssign.vue",
      options: [{ allowUnknown: false }],
      errors: [
        {
          messageId: "issue:any-in-emits",
        },
      ],
    },
  ],
});
