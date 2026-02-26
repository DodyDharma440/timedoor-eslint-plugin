import { requireTypescriptInterfaceProps } from "../rules/require-typescript-interface-props";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run(
  "require-typescript-interface-props",
  requireTypescriptInterfaceProps,
  {
    // ============================================================================
    // VALID TEST CASES
    // Components that correctly use TypeScript type arguments for defineProps
    // ============================================================================
    valid: [
      // --------------------------------------------------------------------------
      // Interface-Based Props Declaration
      // Using named TypeScript interface as type parameter for defineProps
      // --------------------------------------------------------------------------
      {
        code: `
            <script setup lang="ts">
              interface Props {
                msg: string
              }
              defineProps<Props>()
            </script>
          `,
        filename: "ValidInterface.vue",
      },
      {
        code: `
            <script setup lang="ts">
              export interface ComponentProps {
                id: number
                label?: string
              }
              defineProps<ComponentProps>()
            </script>
          `,
        filename: "ValidExportedInterface.vue",
      },
      {
        // Nested interface definition is also valid
        code: `
            <script setup lang="ts">
              namespace Types {
                export interface Props {
                  value: boolean
                }
              }
              defineProps<Types.Props>()
            </script>
          `,
        filename: "ValidNamespacedInterface.vue",
      },
      // --------------------------------------------------------------------------
      // Type Alias-Based Props Declaration
      // Using TypeScript type alias (not interface) is also acceptable
      // --------------------------------------------------------------------------
      {
        code: `
            <script setup lang="ts">
              type Props = {
                count: number
                disabled?: boolean
              }
              defineProps<Props>()
            </script>
          `,
        filename: "ValidTypeAlias.vue",
      },
      {
        code: `
            <script setup lang="ts">
              type ButtonProps = {
                variant: 'primary' | 'secondary'
                onClick: () => void
              }
              defineProps<ButtonProps>()
            </script>
          `,
        filename: "ValidUnionTypeAlias.vue",
      },
      // --------------------------------------------------------------------------
      // Inline Type Literal Declaration
      // Direct inline type argument without named interface/type is valid
      // --------------------------------------------------------------------------
      {
        code: `
            <script setup lang="ts">
              defineProps<{
                title: string
                subtitle?: string
              }>()
            </script>
          `,
        filename: "ValidInlineType.vue",
      },
      {
        code: `
            <script setup lang="ts">
              defineProps<{ modelValue: string }>()
            </script>
          `,
        filename: "ValidInlineSingleProp.vue",
      },
      // --------------------------------------------------------------------------
      // Generic/Utility Type Usage
      // Using utility types or generic references as props type
      // --------------------------------------------------------------------------
      {
        code: `
            <script setup lang="ts">
              import type { User } from '@/types'
              defineProps<{ user: User }>()
            </script>
          `,
        filename: "ValidImportedType.vue",
      },
      {
        code: `
            <script setup lang="ts">
              type BaseProps<T> = {
                data: T
                loading?: boolean
              }
              defineProps<BaseProps<string>>()
            </script>
          `,
        filename: "ValidGenericProps.vue",
      },
      {
        code: `
            <script setup lang="ts">
              import type { ComponentProps } from 'vue'
              defineProps<Pick<ComponentProps<'input'>, 'value' | 'placeholder'>>()
            </script>
          `,
        filename: "ValidUtilityType.vue",
      },
      // --------------------------------------------------------------------------
      // Edge Cases & Exclusions
      // Cases that should not trigger the rule
      // --------------------------------------------------------------------------
      {
        // Non-Vue files are ignored by this rule
        code: `
            const props = defineProps<{ msg: string }>()
          `,
        filename: "ValidNonVueFile.ts",
      },
      {
        // Template-only components (no script) are ignored
        code: `<template><div>Static Content</div></template>`,
        filename: "ValidTemplateOnly.vue",
      },
      {
        // defineProps called in non-setup context (should not match)
        code: `
            <script setup lang="ts">
              function createProps() {
                return defineProps<{ test: boolean }>()
              }
            </script>
          `,
        filename: "ValidNestedCall.vue",
      },
      {
        // Different function name (not defineProps) should be ignored
        code: `
            <script setup lang="ts">
              const props = customDefineProps({ msg: String })
            </script>
          `,
        filename: "ValidDifferentFunction.vue",
      },
    ],

    // ============================================================================
    // INVALID TEST CASES
    // Components that misuse defineProps and should trigger ESLint errors
    // ============================================================================
    invalid: [
      // --------------------------------------------------------------------------
      // Runtime Declaration (Object Syntax) Violations
      // Rule: defineProps must use type argument, not runtime object declaration
      // --------------------------------------------------------------------------
      {
        code: `
            <script setup lang="ts">
              defineProps({
                msg: String
              })
            </script>
          `,
        filename: "InvalidRuntimeObject.vue",
        errors: [
          {
            messageId: "issue:missing-type-parameter",
          },
        ],
      },
      {
        code: `
            <script setup lang="ts">
              defineProps({
                count: {
                  type: Number,
                  required: true
                }
              })
            </script>
          `,
        filename: "InvalidRuntimeVerbose.vue",
        errors: [
          {
            messageId: "issue:missing-type-parameter",
          },
        ],
      },
      {
        // Mixed runtime types with TypeScript still invalid
        code: `
            <script setup lang="ts">
              defineProps({
                items: Array as PropType<string[]>
              })
            </script>
          `,
        filename: "InvalidRuntimeWithPropType.vue",
        errors: [
          {
            messageId: "issue:missing-type-parameter",
          },
        ],
      },

      // --------------------------------------------------------------------------
      // Empty/Missing Type Argument Violations
      // Rule: defineProps() must have a type parameter, cannot be empty
      // --------------------------------------------------------------------------
      {
        code: `
            <script setup lang="ts">
              defineProps()
            </script>
          `,
        filename: "InvalidEmptyCall.vue",
        errors: [
          {
            messageId: "issue:missing-type-parameter",
          },
        ],
      },
      {
        code: `
          <script setup lang="ts">
            const props = defineProps()
          </script>
        `,
        filename: "InvalidEmptyWithAssignment.vue",
        errors: [
          {
            messageId: "issue:missing-type-parameter",
          },
        ],
      },

      // --------------------------------------------------------------------------
      // Hybrid Declaration Violations
      // Rule: Do not mix type arguments with runtime arguments
      // --------------------------------------------------------------------------
      {
        code: `
            <script setup lang="ts">
              interface Props { msg: string }
              defineProps<Props>({ msg: String })
            </script>
          `,
        filename: "InvalidHybridDeclaration.vue",
        errors: [
          {
            messageId: "issue:runtime-declaration",
            data: {
              suggestion:
                "Remove runtime arguments and rely solely on type definition",
            },
          },
        ],
      },
      {
        code: `
            <script setup lang="ts">
              type Props = { count: number }
              defineProps<Props>({ count: { type: Number, default: 0 } })
            </script>
          `,
        filename: "InvalidHybridWithDefaults.vue",
        errors: [
          {
            messageId: "issue:runtime-declaration",
            data: {
              suggestion:
                "Use withDefaults<Props>() for default values instead",
            },
          },
        ],
      },

      // --------------------------------------------------------------------------
      // JavaScript Context Violations
      // Rule: This rule enforces TypeScript usage; JS files should not use defineProps without types
      // Note: In practice, you might want to skip JS files via rule configuration
      // --------------------------------------------------------------------------
      {
        code: `
            <script setup>
              defineProps({
                msg: String
              })
            </script>
          `,
        filename: "InvalidJavaScriptContext.vue",
        errors: [
          {
            messageId: "issue:missing-type-parameter",
          },
        ],
      },

      // --------------------------------------------------------------------------
      // Multiple defineProps Calls (Edge Case)
      // Rule should validate each call independently
      // --------------------------------------------------------------------------
      {
        code: `
            <script setup lang="ts">
              defineProps<{ valid: boolean }>()
              defineProps({ invalid: String })
            </script>
          `,
        filename: "InvalidMultipleCalls.vue",
        errors: [
          {
            messageId: "issue:missing-type-parameter",
          },
        ],
      },
    ],
  },
);
