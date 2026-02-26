import { noDirectAnyInProps } from "../rules/no-direct-any-in-props";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("no-direct-any-in-props", noDirectAnyInProps, {
  // ============================================================================
  // VALID TEST CASES
  // Components that correctly avoid using `any` type in defineProps
  // ============================================================================
  valid: [
    // --------------------------------------------------------------------------
    // Primitive Type Props
    // Using specific primitive types instead of `any`
    // --------------------------------------------------------------------------
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

    // --------------------------------------------------------------------------
    // Interface/Type Alias Props
    // Using named interfaces or type aliases with specific types
    // --------------------------------------------------------------------------
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

    // --------------------------------------------------------------------------
    // Generic/Utility Type Props (without `any`)
    // Using generics with constrained/specific type parameters
    // --------------------------------------------------------------------------
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
            metadata: Partial<{ id: string; timestamp: number }>
          }>()
        </script>
      `,
      filename: "ValidConstrainedRecordProps.vue",
    },
    {
      code: `
        <script setup lang="ts">
          type StrictRecord = Record<'id' | 'name', string>
          defineProps<{ data: StrictRecord }>()
        </script>
      `,
      filename: "ValidMappedTypeProps.vue",
    },

    // --------------------------------------------------------------------------
    // Edge Cases & Exclusions
    // Cases that should not trigger the rule
    // --------------------------------------------------------------------------
    {
      // defineProps without type argument (runtime declaration) - rule ignores this
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
      // Empty defineProps call - no type parameter to check
      code: `
        <script setup lang="ts">
          defineProps()
        </script>
      `,
      filename: "ValidEmptyCall.vue",
    },
    {
      // Non-Vue file - rule only processes Vue SFC via withTemplateVisitor
      code: `
        export function createProps<T>() {
          return {} as T
        }
      `,
      filename: "ValidNonVueFile.ts",
    },
    {
      // defineProps with unknown (not any) - different type, should pass
      code: `
        <script setup lang="ts">
          defineProps<{
            data: unknown
          }>()
        </script>
      `,
      filename: "ValidUnknownProp.vue",
    },
    {
      // Nested object with specific types - no any anywhere
      code: `
        <script setup lang="ts">
          defineProps<{
            user: {
              profile: {
                name: string
                settings: {
                  theme: 'light' | 'dark'
                }
              }
            }
          }>()
        </script>
      `,
      filename: "ValidDeeplyNestedProps.vue",
    },
  ],

  // ============================================================================
  // INVALID TEST CASES
  // Components that use `any` type in props and should trigger ESLint errors
  // ============================================================================
  invalid: [
    // --------------------------------------------------------------------------
    // Direct `any` Type Usage
    // Rule: defineProps<any> is not allowed
    // --------------------------------------------------------------------------
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
          line: 3,
          column: 11,
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
          line: 3,
          column: 25,
        },
      ],
    },
  ],
});
