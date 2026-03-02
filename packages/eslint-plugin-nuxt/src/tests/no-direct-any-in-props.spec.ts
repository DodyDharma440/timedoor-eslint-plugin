import { noDirectAnyInProps } from "../rules/no-direct-any-in-props";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("no-direct-any-in-props", noDirectAnyInProps, {
  valid: [
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            msg: string
          }>()
        </script>
      `,
      filename: "ValidStringProp.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            count: number
            disabled?: boolean
          }>()
        </script>
      `,
      filename: "ValidPrimitiveProps.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            id: number | string
            status: 'active' | 'inactive'
          }>()
        </script>
      `,
      filename: "ValidUnionProps.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface Props {
            title: string
            items: string[]
          }
          defineProps<Props>()
        </script>
      `,
      filename: "ValidInterfaceProps.vue",
    },
    {
      code: `
        <script setup lang="ts">
          type User = {
            name: string
            age: number
          }
          defineProps<{ user: User }>()
        </script>
      `,
      filename: "ValidTypeAliasProp.vue",
    },
    {
      code: `
        <script setup lang="ts">
          import type { Product } from '@/types'
          defineProps<{ product: Product }>()
        </script>
      `,
      filename: "ValidImportedTypeProp.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            items: Array<string>
            callback: (value: number) => void
          }>()
        </script>
      `,
      filename: "ValidGenericProps.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            config: Record<string, string>
          }>()
        </script>
      `,
      filename: "ValidConstrainedRecordProps.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps({
            msg: String
          })
        </script>
      `,
      filename: "ValidRuntimeDeclaration.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps()
        </script>
      `,
      filename: "ValidEmptyCall.vue",
    },
    {
      code: `
        export function createProps<T>() {
          return {} as T
        }
      `,
      filename: "ValidNonVueFile.ts",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<unknown>()
        </script>
      `,
      filename: "ValidUnknownAllowed.vue",
      options: [{ allowUnknown: true }],
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            user: {
              profile: {
                name: string
              }
            }
          }>()
        </script>
      `,
      filename: "ValidDeeplyNestedProps.vue",
    },
  ],
  invalid: [
    {
      code: `
        <script setup lang="ts">
          defineProps<any>()
        </script>
      `,
      filename: "InvalidDirectAny.vue",
      errors: [
        {
          messageId: "issue:any-in-props",
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          const props = defineProps<any>()
        </script>
      `,
      filename: "InvalidDirectAnyWithAssignment.vue",
      errors: [
        {
          messageId: "issue:any-in-props",
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<unknown>()
        </script>
      `,
      filename: "InvalidUnknownDisallowed.vue",
      options: [{ allowUnknown: false }],
      errors: [
        {
          messageId: "issue:any-in-props",
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          const p = defineProps<unknown>()
        </script>
      `,
      filename: "InvalidUnknownDisallowedAssign.vue",
      options: [{ allowUnknown: false }],
      errors: [
        {
          messageId: "issue:any-in-props",
        },
      ],
    },
  ],
});
