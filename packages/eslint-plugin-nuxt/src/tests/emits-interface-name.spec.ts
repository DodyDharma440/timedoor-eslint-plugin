import { emitsInterfaceName } from "../rules/emits-interface-name";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("emits-interface-name", emitsInterfaceName, {
  valid: [
    {
      code: `
        <script setup lang="ts">
          interface ButtonEmits {
            (e: 'click'): void
            (e: 'submit', value: string): void
          }
          defineEmits<ButtonEmits>()
        </script>
      `,
      filename: "button.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface UserProfileCardEmits {
            (e: 'update', id: number): void
            (e: 'delete', id: number): void
          }
          defineEmits<UserProfileCardEmits>()
        </script>
      `,
      filename: "user-profile-card.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface ModalEmits {
            (e: 'open'): void
            (e: 'close'): void
            (e: 'confirm'): void
          }
          defineEmits<ModalEmits>()
        </script>
      `,
      filename: "Modal.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface InputFieldEmits {
            (e: 'update:modelValue', value: string): void
            (e: 'blur'): void
            (e: 'focus'): void
          }
          defineEmits<InputFieldEmits>()
        </script>
      `,
      filename: "/components/ui/input/input-field.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits(['click', 'submit'])
        </script>
      `,
      filename: "button.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineEmits<{
            (e: 'click'): void
            (e: 'update', value: string): void
          }>()
        </script>
      `,
      filename: "button.vue",
    },
    {
      code: `
        <script setup lang="ts">
          type CardEmits = {
            (e: 'select', id: number): void
            (e: 'dismiss'): void
          }
          defineEmits<CardEmits>()
        </script>
      `,
      filename: "card.vue",
    },
    {
      code: `
        <script setup lang="ts">
          import type { ButtonEmits } from '@/types/components'
          defineEmits<ButtonEmits>()
        </script>
      `,
      filename: "button.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface IButtonEmits {
            (e: 'click'): void
          }
          defineEmits<IButtonEmits>()
        </script>
      `,
      filename: "button.vue",
      options: [{ pattern: "^I{{FileName}}Emits$" }],
    },
    {
      code: `
        <script setup lang="ts">
          interface UserProfileTypes {
            (e: 'update', name: string): void
          }
          defineEmits<UserProfileTypes>()
        </script>
      `,
      filename: "user-profile.vue",
      options: [{ pattern: "^{{FileName}}Types$" }],
    },
    {
      code: `
        <script setup lang="ts">
          interface Button {
            (e: 'click'): void
          }
          defineEmits<Button>()
        </script>
      `,
      filename: "button.vue",
      options: [{ pattern: "^{{FileName}}$" }],
    },
  ],
  invalid: [
    {
      code: `
        <script setup lang="ts">
          interface Emits {
            (e: 'click'): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "button.vue",
      output: `
        <script setup lang="ts">
          interface ButtonEmits {
            (e: 'click'): void
          }
          defineEmits<ButtonEmits>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "Emits",
            expectedPattern: "^ButtonEmits$",
            expectedName: "ButtonEmits",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "ButtonEmits" },
              output: `
        <script setup lang="ts">
          interface ButtonEmits {
            (e: 'click'): void
          }
          defineEmits<ButtonEmits>()
        </script>
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          interface ButtonInterface {
            (e: 'click'): void
            (e: 'submit', value: string): void
          }
          defineEmits<ButtonInterface>()
        </script>
      `,
      filename: "button.vue",
      output: `
        <script setup lang="ts">
          interface ButtonEmits {
            (e: 'click'): void
            (e: 'submit', value: string): void
          }
          defineEmits<ButtonEmits>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "ButtonInterface",
            expectedPattern: "^ButtonEmits$",
            expectedName: "ButtonEmits",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "ButtonEmits" },
              output: `
        <script setup lang="ts">
          interface ButtonEmits {
            (e: 'click'): void
            (e: 'submit', value: string): void
          }
          defineEmits<ButtonEmits>()
        </script>
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          interface Emits {
            (e: 'update', name: string): void
            (e: 'delete', id: number): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "user-profile.vue",
      output: `
        <script setup lang="ts">
          interface UserProfileEmits {
            (e: 'update', name: string): void
            (e: 'delete', id: number): void
          }
          defineEmits<UserProfileEmits>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "Emits",
            expectedPattern: "^UserProfileEmits$",
            expectedName: "UserProfileEmits",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "UserProfileEmits" },
              output: `
        <script setup lang="ts">
          interface UserProfileEmits {
            (e: 'update', name: string): void
            (e: 'delete', id: number): void
          }
          defineEmits<UserProfileEmits>()
        </script>
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          interface Emits {
            (e: 'open'): void
            (e: 'close'): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "Modal.vue",
      output: `
        <script setup lang="ts">
          interface ModalEmits {
            (e: 'open'): void
            (e: 'close'): void
          }
          defineEmits<ModalEmits>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "Emits",
            expectedPattern: "^ModalEmits$",
            expectedName: "ModalEmits",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "ModalEmits" },
              output: `
        <script setup lang="ts">
          interface ModalEmits {
            (e: 'open'): void
            (e: 'close'): void
          }
          defineEmits<ModalEmits>()
        </script>
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          interface Emits {
            (e: 'update:modelValue', value: string): void
          }
          defineEmits<Emits>()
        </script>
      `,
      filename: "/src/components/forms/input-field.vue",
      output: `
        <script setup lang="ts">
          interface InputFieldEmits {
            (e: 'update:modelValue', value: string): void
          }
          defineEmits<InputFieldEmits>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "Emits",
            expectedPattern: "^InputFieldEmits$",
            expectedName: "InputFieldEmits",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "InputFieldEmits" },
              output: `
        <script setup lang="ts">
          interface InputFieldEmits {
            (e: 'update:modelValue', value: string): void
          }
          defineEmits<InputFieldEmits>()
        </script>
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          interface buttonEmits {
            (e: 'click'): void
          }
          defineEmits<buttonEmits>()
        </script>
      `,
      filename: "button.vue",
      output: `
        <script setup lang="ts">
          interface ButtonEmits {
            (e: 'click'): void
          }
          defineEmits<ButtonEmits>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "buttonEmits",
            expectedPattern: "^ButtonEmits$",
            expectedName: "ButtonEmits",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "ButtonEmits" },
              output: `
        <script setup lang="ts">
          interface ButtonEmits {
            (e: 'click'): void
          }
          defineEmits<ButtonEmits>()
        </script>
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          interface ButtonEmits { (e: 'click'): void }
          defineEmits<ButtonEmits>()
          
          interface WrongName { (e: 'submit', value: string): void }
          defineEmits<WrongName>()
        </script>
      `,
      filename: "button.vue",
      output: `
        <script setup lang="ts">
          interface ButtonEmits { (e: 'click'): void }
          defineEmits<ButtonEmits>()
          
          interface ButtonEmits { (e: 'submit', value: string): void }
          defineEmits<ButtonEmits>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "WrongName",
            expectedPattern: "^ButtonEmits$",
            expectedName: "ButtonEmits",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "ButtonEmits" },
              output: `
        <script setup lang="ts">
          interface ButtonEmits { (e: 'click'): void }
          defineEmits<ButtonEmits>()
          
          interface ButtonEmits { (e: 'submit', value: string): void }
          defineEmits<ButtonEmits>()
        </script>
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          interface ButtonEmits {
            (e: 'click'): void
          }
          defineEmits<ButtonEmits>()
        </script>
      `,
      filename: "button.vue",
      options: [{ pattern: "^I{{FileName}}Emits$" }],
      output: `
        <script setup lang="ts">
          interface IButtonEmits {
            (e: 'click'): void
          }
          defineEmits<IButtonEmits>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "ButtonEmits",
            expectedPattern: "^IButtonEmits$",
            expectedName: "IButtonEmits",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "IButtonEmits" },
              output: `
        <script setup lang="ts">
          interface IButtonEmits {
            (e: 'click'): void
          }
          defineEmits<IButtonEmits>()
        </script>
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
        <script setup lang="ts">
          interface IButton {
            (e: 'click'): void
          }
          defineEmits<IButton>()
        </script>
      `,
      filename: "button.vue",
      options: [{ pattern: "^I{{FileName}}Emits$" }],
      output: `
        <script setup lang="ts">
          interface IButtonEmits {
            (e: 'click'): void
          }
          defineEmits<IButtonEmits>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "IButton",
            expectedPattern: "^IButtonEmits$",
            expectedName: "IButtonEmits",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "IButtonEmits" },
              output: `
        <script setup lang="ts">
          interface IButtonEmits {
            (e: 'click'): void
          }
          defineEmits<IButtonEmits>()
        </script>
      `,
            },
          ],
        },
      ],
    },
  ],
});
