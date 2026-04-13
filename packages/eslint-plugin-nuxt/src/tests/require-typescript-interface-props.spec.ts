import { requireTypescriptInterfaceProps } from "../rules/require-typescript-interface-props";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run(
  "require-typescript-interface-props",
  requireTypescriptInterfaceProps,
  {
    valid: [
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
      {
        code: `
            const props = defineProps<{ msg: string }>()
          `,
        filename: "ValidNonVueFile.ts",
      },
      {
        code: `<template><div>Static Content</div></template>`,
        filename: "ValidTemplateOnly.vue",
      },
      {
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
        code: `
            <script setup lang="ts">
              const props = customDefineProps({ msg: String })
            </script>
          `,
        filename: "ValidDifferentFunction.vue",
      },
    ],
    invalid: [
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
