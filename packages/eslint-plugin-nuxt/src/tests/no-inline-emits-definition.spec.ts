import { noInlineEmitsDefinition } from "../rules/no-inline-emits-definition";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("no-inline-emits-definition", noInlineEmitsDefinition, {
  // ============================================================================
  // VALID TEST CASES
  // Components that correctly avoid inline emits definition or stay within limits
  // ============================================================================
  valid: [
    // --------------------------------------------------------------------------
    // Type-Based Emits Declaration (Interface/Type Alias)
    // These should always pass regardless of property count
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          interface Emits {
            (event: 'msg', value: string): void
            (event: 'count', value: number): void
            (event: 'disabled', value?: boolean): void
            (event: 'update:items', items: string[]): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "ValidInterfaceEmits.vue",
    },
    {
      code: `
        <script setup lang="ts">
          type ComponentEmits = {
            (event: 'title', value: string): void
            (event: 'subtitle', value?: string): void
            (event: 'click'): void
          }
          defineEmits<ComponentEmits>()
        </script>
      `,
      filename: "ValidTypeAliasEmits.vue",
    },
    {
      code: `
        <script setup lang="ts">
          import type { UserEmits } from '@/types'
          defineEmits<UserEmits>()
        </script>
      `,
      filename: "ValidImportedTypeEmits.vue",
    },

    // --------------------------------------------------------------------------
    // Inline Type Literal Within Allowed Limit (Default: eventsLimit = 2)
    // Inline definitions with 1-2 properties should pass with default options
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineEmits<{ msg: [value: string] }>()
        </script>
      `,
      filename: "ValidInlineSingleProp.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            msg: [value: string]
            count: [value: number]
          }>()
        </script>
      `,
      filename: "ValidInlineTwoEmits.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            id: [value: number]
            label: [value?: string]
          }>()
        </script>
      `,
      filename: "ValidInlineOptionalEmits.vue",
    },

    // --------------------------------------------------------------------------
    // Inline Type Literal Within Custom Limit (eventsLimit overridden)
    // When limit is increased, more properties are allowed inline
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            a: [value: string]
            b: [value: number]
            c: [value: boolean]
          }>()
        </script>
      `,
      filename: "ValidInlineThreeEmitsCustomLimit.vue",
      options: [{ eventsLimit: 3 }],
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            p1: [value: string]
            p2: [value: string]
            p3: [value: string]
            p4: [value: string]
            p5: [value: string]
          }>()
        </script>
      `,
      filename: "ValidInlineFiveEmitsHighLimit.vue",
      options: [{ eventsLimit: 5 }],
    },

    // --------------------------------------------------------------------------
    // Runtime Declaration (No Type Parameter)
    // Rule ignores runtime-style emits definition
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineEmits({
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
          defineEmits({
            a: String,
            b: Number,
            c: Boolean,
            d: Array,
            e: Object
          })
        </script>
      `,
      filename: "ValidRuntimeManyEmits.vue",
    },

    // --------------------------------------------------------------------------
    // Edge Cases & Exclusions
    // Cases that should not trigger the rule
    // --------------------------------------------------------------------------
    {
      // Empty defineEmits call (no type argument) - ignored by rule
      code: `
        <script setup lang="ts">
          defineEmits()
        </script>
      `,
      filename: "ValidEmptyCall.vue",
    },
    {
      // Non-Vue file - rule only processes .vue files
      code: `
        export function createEmits<T>() {
          return {} as T
        }
      `,
      filename: "ValidNonVueFile.ts",
    },
    {
      // Inline type with exactly the limit (boundary case)
      code: `
        <script setup lang="ts">
          defineEmits<{
            first: [value: string]
            second: [value: number]
          }>()
        </script>
      `,
      filename: "ValidInlineBoundaryCase.vue",
    },
    {
      // Complex types but still within property count limit
      code: `
        <script setup lang="ts">
          defineEmits<{
            config: [config: Record<string, string>]
            callback: [val: number]
          }>()
        </script>
      `,
      filename: "ValidInlineComplexTypes.vue",
    },
  ],

  // ============================================================================
  // INVALID TEST CASES
  // Components that violate inline emits definition rules and should trigger errors
  // ============================================================================
  invalid: [
    // --------------------------------------------------------------------------
    // Empty Inline Object Violation
    // Rule: defineEmits<{}>() is not allowed (issue:empty-inline-emits)
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineEmits<{}>()
        </script>
      `,
      filename: "InvalidEmptyInlineObject.vue",
      errors: [{ messageId: "issue:empty-inline-emits" }],
    },
    {
      code: `
        <script setup lang="ts">
          const emits = defineEmits<{}>()
        </script>
      `,
      filename: "InvalidEmptyInlineObjectWithAssignment.vue",
      errors: [{ messageId: "issue:empty-inline-emits" }],
    },

    // --------------------------------------------------------------------------
    // Inline Object Exceeding Default Limit (eventsLimit = 2)
    // Rule: Inline definitions with >2 properties trigger issue:inline-emits
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            a: [value: string]
            b: [value: number]
            c: [value: boolean]
          }>()
        </script>
      `,
      filename: "InvalidInlineThreeEmitsDefaultLimit.vue",
      errors: [{ messageId: "issue:inline-emits" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            title: [value: string]
            subtitle: [value?: string]
            click: []
            disabled: [value?: boolean]
          }>()
        </script>
      `,
      filename: "InvalidInlineFourEmits.vue",
      errors: [{ messageId: "issue:inline-emits" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            id: [value: number]
            name: [value: string]
            email: [value: string]
            role: [value: string]
            active: [value: boolean]
            metadata: [value: Record<string, unknown>]
          }>()
        </script>
      `,
      filename: "InvalidInlineManyEmits.vue",
      errors: [{ messageId: "issue:inline-emits" }],
    },

    // --------------------------------------------------------------------------
    // Inline Object Exceeding Custom Limit (eventsLimit overridden)
    // When limit is lowered, fewer properties are allowed inline
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            msg: [value: string]
            count: [value: number]
          }>()
        </script>
      `,
      filename: "InvalidInlineTwoEmitsWithLimitOne.vue",
      options: [{ eventsLimit: 1 }],
      errors: [{ messageId: "issue:inline-emits" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            msg: [value: string]
          }>()
        </script>
      `,
      filename: "InvalidInlineOnePropWithLimitZero.vue",
      options: [{ eventsLimit: 0 }],
      errors: [{ messageId: "issue:inline-emits" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            p1: [value: string]
            p2: [value: string]
            p3: [value: string]
            p4: [value: string]
          }>()
        </script>
      `,
      filename: "InvalidInlineFourEmitsWithLimitThree.vue",
      options: [{ eventsLimit: 3 }],
      errors: [{ messageId: "issue:inline-emits" }],
    },

    // --------------------------------------------------------------------------
    // Boundary Cases: Exactly at Limit vs Exceeding Limit
    // Ensures rule correctly handles edge boundaries
    // --------------------------------------------------------------------------
    {
      // 3 emits with limit=2 -> should fail
      code: `
        <script setup lang="ts">
          defineEmits<{ x: [value: string]; y: [value: number]; z: [value: boolean] }>()
        </script>
      `,
      filename: "InvalidBoundaryExceedsLimit.vue",
      errors: [{ messageId: "issue:inline-emits" }],
    },

    // --------------------------------------------------------------------------
    // Mixed Scenarios: Multiple defineEmits Calls
    // Only the violating call should trigger an error
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineEmits<{ valid: [value: string] }>()
          defineEmits<{
            a: [value: string]
            b: [value: number]
            c: [value: boolean]
          }>()
        </script>
      `,
      filename: "InvalidMultipleCallsOneViolates.vue",
      errors: [{ messageId: "issue:inline-emits" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<{}>()
          interface Emits { (event: 'msg', value: string): void }
          defineEmits<Emits>()
        </script>
      `,
      filename: "InvalidMultipleCallsEmptyInline.vue",
      errors: [{ messageId: "issue:empty-inline-emits" }],
    },

    // --------------------------------------------------------------------------
    // Options Override: Strict Mode (eventsLimit = 0)
    // Disallow ALL inline type literals, even with 1 property
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineEmits<{ msg: [value: string] }>()
        </script>
      `,
      filename: "InvalidStrictModeSingleProp.vue",
      options: [{ eventsLimit: 0 }],
      errors: [{ messageId: "issue:inline-emits" }],
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            a: [value: string]
            b: [value: number]
          }>()
        </script>
      `,
      filename: "InvalidStrictModeTwoEmits.vue",
      options: [{ eventsLimit: 0 }],
      errors: [{ messageId: "issue:inline-emits" }],
    },

    // --------------------------------------------------------------------------
    // Complex Inline Types Exceeding Limit
    // Rule counts properties, not complexity of type values
    // --------------------------------------------------------------------------
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            simple: [value: string]
            nested: [value: { deep: { value: number } }]
            callback: [event: Event]
            items: [items: string[]]
          }>()
        </script>
      `,
      filename: "InvalidInlineComplexTypesExceedLimit.vue",
      errors: [{ messageId: "issue:inline-emits" }],
    },
  ],
});
