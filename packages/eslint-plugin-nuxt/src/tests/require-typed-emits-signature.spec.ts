import { requireTypedEmitsSignature } from "../rules/require-typed-emits-signature";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("require-typed-emits-signature", requireTypedEmitsSignature, {
  valid: [
    {
      code: `
          <script setup lang="ts">
            const emit = defineEmits<{
              (e: 'click'): void
            }>()
          </script>
        `,
      filename: "ValidCallSignatureSingle.vue",
    },
    {
      code: `
          <script setup lang="ts">
            const emit = defineEmits<{
              (e: 'save', value: string): void
              (e: 'cancel'): void
            }>()
          </script>
        `,
      filename: "ValidCallSignatureMultiple.vue",
    },
    {
      code: `
          <script setup lang="ts">
            const emit = defineEmits<{
              click: []
              save: [value: string]
            }>()
          </script>
        `,
      filename: "ValidRecordStyle.vue",
    },
    {
      code: `
          <script setup lang="ts">
            const emit = defineEmits<{
              update: [id: number, name: string]
              delete: [id: number]
            }>()
          </script>
        `,
      filename: "ValidRecordStyleMultiplePayloads.vue",
    },
    {
      code: `
          <script setup lang="ts">
            interface Emits {
              (e: 'submit', data: FormData): void
            }
            const emit = defineEmits<Emits>()
          </script>
        `,
      filename: "ValidInterfaceRef.vue",
    },
    {
      code: `
          <script setup lang="ts">
            type ComponentEmits = {
              (e: 'open'): void
              (e: 'close', reason: string): void
            }
            const emit = defineEmits<ComponentEmits>()
          </script>
        `,
      filename: "ValidTypeAliasRef.vue",
    },
    {
      code: `
          <script setup lang="ts">
            import type { MyEmits } from '@/types'
            const emit = defineEmits<MyEmits>()
          </script>
        `,
      filename: "ValidImportedTypeRef.vue",
    },
    {
      code: `
          <script setup lang="ts">
            const emit = defineEmits(['click', 'save'])
          </script>
        `,
      filename: "ValidStringArrayAllowed.vue",
      options: [{ allowStringArray: true }],
    },
    {
      code: `
          <script setup lang="ts">
            const emit = defineEmits(['update:modelValue'])
          </script>
        `,
      filename: "ValidStringArrayVModelAllowed.vue",
      options: [{ allowStringArray: true }],
    },
    {
      code: `
          const emit = defineEmits(['click'])
        `,
      filename: "SomeComposable.ts",
    },
  ],
  invalid: [
    {
      code: `
          <script setup lang="ts">
            const emit = defineEmits(['click'])
          </script>
        `,
      filename: "InvalidStringArraySingle.vue",
      errors: [{ messageId: "issue:no-typed-emits" }],
    },
    {
      code: `
          <script setup lang="ts">
            const emit = defineEmits(['save', 'cancel', 'update:modelValue'])
          </script>
        `,
      filename: "InvalidStringArrayMultiple.vue",
      errors: [{ messageId: "issue:no-typed-emits" }],
    },
    {
      code: `
          <script setup lang="ts">
            defineEmits(['open', 'close'])
          </script>
        `,
      filename: "InvalidStringArrayNoAssign.vue",
      errors: [{ messageId: "issue:no-typed-emits" }],
    },
    {
      code: `
          <script setup lang="ts">
            const emit = defineEmits()
          </script>
        `,
      filename: "InvalidEmptyCall.vue",
      errors: [{ messageId: "issue:no-typed-emits" }],
    },
    {
      code: `
          <script setup lang="ts">
            defineEmits()
          </script>
        `,
      filename: "InvalidEmptyCallNoAssign.vue",
      errors: [{ messageId: "issue:no-typed-emits" }],
    },
    {
      code: `
          <script setup lang="ts">
            const emit = defineEmits()
          </script>
        `,
      filename: "InvalidEmptyCallWithOptionAllowArray.vue",
      options: [{ allowStringArray: true }],
      errors: [{ messageId: "issue:no-typed-emits" }],
    },
  ],
});
