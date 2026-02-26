import { noInlinePropsDefinition } from "../rules/no-inline-props-definition";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("no-inline-props-definition", noInlinePropsDefinition, {
  // ============================================================================
  // VALID TEST CASES
  // Components that correctly avoid inline props definition or stay within limits
  // ============================================================================
  valid: [
    // --------------------------------------------------------------------------
    // Type-Based Props Declaration (Interface/Type Alias)
    // These should always pass regardless of property count
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          interface Props {
            msg: string
            count: number
            disabled?: boolean
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
          type ComponentProps = {
            title: string
            subtitle?: string
            onClick: () => void
          }
          defineProps<ComponentProps>()
        </script>
      `,
      filename: "ValidTypeAliasProps.vue",
    },
    {
      code: `
        <script setup lang="ts">
          import type { UserProps } from '@/types'
          defineProps<UserProps>()
        </script>
      `,
      filename: "ValidImportedTypeProps.vue",
    },

    // --------------------------------------------------------------------------
    // Inline Type Literal Within Allowed Limit (Default: propertiesLimit = 2)
    // Inline definitions with 1-2 properties should pass with default options
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineProps<{ msg: string }>()
        </script>
      `,
      filename: "ValidInlineSingleProp.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            msg: string
            count: number
          }>()
        </script>
      `,
      filename: "ValidInlineTwoProps.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            id: number
            label?: string
          }>()
        </script>
      `,
      filename: "ValidInlineOptionalProps.vue",
    },

    // --------------------------------------------------------------------------
    // Inline Type Literal Within Custom Limit (propertiesLimit overridden)
    // When limit is increased, more properties are allowed inline
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            a: string
            b: number
            c: boolean
          }>()
        </script>
      `,
      filename: "ValidInlineThreePropsCustomLimit.vue",
      options: [{ propertiesLimit: 3 }],
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            p1: string
            p2: string
            p3: string
            p4: string
            p5: string
          }>()
        </script>
      `,
      filename: "ValidInlineFivePropsHighLimit.vue",
      options: [{ propertiesLimit: 5 }],
    },

    // --------------------------------------------------------------------------
    // Runtime Declaration (No Type Parameter)
    // Rule ignores runtime-style props definition
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineProps({
            msg: String,
            count: Number
          })
        </script>
      `,
      filename: "ValidRuntimeDeclaration.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps({
            a: String,
            b: Number,
            c: Boolean,
            d: Array,
            e: Object
          })
        </script>
      `,
      filename: "ValidRuntimeManyProps.vue",
    },

    // --------------------------------------------------------------------------
    // Edge Cases & Exclusions
    // Cases that should not trigger the rule
    // --------------------------------------------------------------------------
    {
      // Empty defineProps call (no type argument) - ignored by rule
      code: `
        <script setup lang="ts">
          defineProps()
        </script>
      `,
      filename: "ValidEmptyCall.vue",
    },
    {
      // Non-Vue file - rule only processes .vue files
      code: `
        export function createProps<T>() {
          return {} as T
        }
      `,
      filename: "ValidNonVueFile.ts",
    },
    {
      // Inline type with exactly the limit (boundary case)
      code: `
        <script setup lang="ts">
          defineProps<{
            first: string
            second: number
          }>()
        </script>
      `,
      filename: "ValidInlineBoundaryCase.vue",
    },
    {
      // Complex types but still within property count limit
      code: `
        <script setup lang="ts">
          defineProps<{
            config: Record<string, string>
            callback: (val: number) => void
          }>()
        </script>
      `,
      filename: "ValidInlineComplexTypes.vue",
    },
  ],

  // ============================================================================
  // INVALID TEST CASES
  // Components that violate inline props definition rules and should trigger errors
  // ============================================================================
  invalid: [
    // --------------------------------------------------------------------------
    // Empty Inline Object Violation
    // Rule: defineProps<{}>() is not allowed (issue:empty-inline-object)
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineProps<{}>()
        </script>
      `,
      filename: "InvalidEmptyInlineObject.vue",
      errors: [{ messageId: "issue:empty-inline-object" }],
    },
    {
      code: `
        <script setup lang="ts">
          const props = defineProps<{}>()
        </script>
      `,
      filename: "InvalidEmptyInlineObjectWithAssignment.vue",
      errors: [{ messageId: "issue:empty-inline-object" }],
    },

    // --------------------------------------------------------------------------
    // Inline Object Exceeding Default Limit (propertiesLimit = 2)
    // Rule: Inline definitions with >2 properties trigger issue:inline-object
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            a: string
            b: number
            c: boolean
          }>()
        </script>
      `,
      filename: "InvalidInlineThreePropsDefaultLimit.vue",
      errors: [{ messageId: "issue:inline-object" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            title: string
            subtitle?: string
            onClick: () => void
            disabled?: boolean
          }>()
        </script>
      `,
      filename: "InvalidInlineFourProps.vue",
      errors: [{ messageId: "issue:inline-object" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            id: number
            name: string
            email: string
            role: string
            active: boolean
            metadata: Record<string, unknown>
          }>()
        </script>
      `,
      filename: "InvalidInlineManyProps.vue",
      errors: [{ messageId: "issue:inline-object" }],
    },

    // --------------------------------------------------------------------------
    // Inline Object Exceeding Custom Limit (propertiesLimit overridden)
    // When limit is lowered, fewer properties are allowed inline
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            msg: string
            count: number
          }>()
        </script>
      `,
      filename: "InvalidInlineTwoPropsWithLimitOne.vue",
      options: [{ propertiesLimit: 1 }],
      errors: [{ messageId: "issue:inline-object" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            a: string
          }>()
        </script>
      `,
      filename: "InvalidInlineOnePropWithLimitZero.vue",
      options: [{ propertiesLimit: 0 }],
      errors: [{ messageId: "issue:inline-object" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            p1: string
            p2: string
            p3: string
            p4: string
          }>()
        </script>
      `,
      filename: "InvalidInlineFourPropsWithLimitThree.vue",
      options: [{ propertiesLimit: 3 }],
      errors: [{ messageId: "issue:inline-object" }],
    },

    // --------------------------------------------------------------------------
    // Boundary Cases: Exactly at Limit vs Exceeding Limit
    // Ensures rule correctly handles edge boundaries
    // --------------------------------------------------------------------------
    {
      // 3 props with limit=2 -> should fail
      code: `
        <script setup lang="ts">
          defineProps<{ x: string; y: number; z: boolean }>()
        </script>
      `,
      filename: "InvalidBoundaryExceedsLimit.vue",
      errors: [{ messageId: "issue:inline-object" }],
    },

    // --------------------------------------------------------------------------
    // Mixed Scenarios: Multiple defineProps Calls
    // Only the violating call should trigger an error
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineProps<{ valid: string }>()
          defineProps<{
            a: string
            b: number
            c: boolean
          }>()
        </script>
      `,
      filename: "InvalidMultipleCallsOneViolates.vue",
      errors: [{ messageId: "issue:inline-object" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{}>()
          interface Props { msg: string }
          defineProps<Props>()
        </script>
      `,
      filename: "InvalidMultipleCallsEmptyInline.vue",
      errors: [{ messageId: "issue:empty-inline-object" }],
    },

    // --------------------------------------------------------------------------
    // Options Override: Strict Mode (propertiesLimit = 0)
    // Disallow ALL inline type literals, even with 1 property
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineProps<{ msg: string }>()
        </script>
      `,
      filename: "InvalidStrictModeSingleProp.vue",
      options: [{ propertiesLimit: 0 }],
      errors: [{ messageId: "issue:inline-object" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            a: string
            b: number
          }>()
        </script>
      `,
      filename: "InvalidStrictModeTwoProps.vue",
      options: [{ propertiesLimit: 0 }],
      errors: [{ messageId: "issue:inline-object" }],
    },

    // --------------------------------------------------------------------------
    // Complex Inline Types Exceeding Limit
    // Rule counts properties, not complexity of type values
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            simple: string
            nested: { deep: { value: number } }
            callback: (e: Event) => void
            items: Array<string>
          }>()
        </script>
      `,
      filename: "InvalidInlineComplexTypesExceedLimit.vue",
      errors: [{ messageId: "issue:inline-object" }],
    },
  ],
});
