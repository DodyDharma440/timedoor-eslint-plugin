import { propsInterfaceName } from "../rules/props-interface-name";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("props-interface-name", propsInterfaceName, {
  valid: [
    {
      code: `
        <script setup lang="ts">
          interface ButtonProps {
            label: string
            variant?: 'primary' | 'secondary'
          }
          defineProps<ButtonProps>()
        </script>
      `,
      filename: "button.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface UserProfileCardProps {
            name: string
            avatarUrl: string
            bio?: string
          }
          defineProps<UserProfileCardProps>()
        </script>
      `,
      filename: "user-profile-card.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface ModalProps {
            open: boolean
            onClose: () => void
          }
          defineProps<ModalProps>()
        </script>
      `,
      filename: "Modal.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface InputFieldProps {
            modelValue: string
            placeholder?: string
            error?: string
          }
          defineProps<InputFieldProps>()
        </script>
      `,
      filename: "/components/ui/input/input-field.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps({
            label: String,
            variant: String
          })
        </script>
      `,
      filename: "button.vue",
    },
    {
      code: `
        <script setup lang="ts">
          defineProps<{
            label: string
            disabled?: boolean
          }>()
        </script>
      `,
      filename: "button.vue",
    },
    {
      code: `
        <script setup lang="ts">
          type CardProps = {
            title: string
            content: string
          }
          defineProps<CardProps>()
        </script>
      `,
      filename: "card.vue",
    },
    {
      code: `
        <script setup lang="ts">
          import type { ButtonProps } from '@/types/components'
          defineProps<ButtonProps>()
        </script>
      `,
      filename: "button.vue",
    },
    {
      code: `
        <script setup lang="ts">
          interface IButtonProps {
            label: string
          }
          defineProps<IButtonProps>()
        </script>
      `,
      filename: "button.vue",
      options: [{ pattern: "^I{{FileName}}Props$" }],
    },
    {
      code: `
        <script setup lang="ts">
          interface UserProfileTypes {
            name: string
          }
          defineProps<UserProfileTypes>()
        </script>
      `,
      filename: "user-profile.vue",
      options: [{ pattern: "^{{FileName}}Types$" }],
    },
    {
      code: `
        <script setup lang="ts">
          interface Button {
            label: string
          }
          defineProps<Button>()
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
          interface Props {
            label: string
          }
          defineProps<Props>()
        </script>
      `,
      filename: "button.vue",
      output: `
        <script setup lang="ts">
          interface ButtonProps {
            label: string
          }
          defineProps<ButtonProps>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "Props",
            expectedPattern: "^ButtonProps$",
            expectedName: "ButtonProps",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "ButtonProps" },
              output: `
        <script setup lang="ts">
          interface ButtonProps {
            label: string
          }
          defineProps<ButtonProps>()
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
            label: string
            variant?: string
          }
          defineProps<ButtonInterface>()
        </script>
      `,
      filename: "button.vue",
      output: `
        <script setup lang="ts">
          interface ButtonProps {
            label: string
            variant?: string
          }
          defineProps<ButtonProps>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "ButtonInterface",
            expectedPattern: "^ButtonProps$",
            expectedName: "ButtonProps",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "ButtonProps" },
              output: `
        <script setup lang="ts">
          interface ButtonProps {
            label: string
            variant?: string
          }
          defineProps<ButtonProps>()
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
          interface Props {
            name: string
            email: string
          }
          defineProps<Props>()
        </script>
      `,
      filename: "user-profile.vue",
      output: `
        <script setup lang="ts">
          interface UserProfileProps {
            name: string
            email: string
          }
          defineProps<UserProfileProps>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "Props",
            expectedPattern: "^UserProfileProps$",
            expectedName: "UserProfileProps",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "UserProfileProps" },
              output: `
        <script setup lang="ts">
          interface UserProfileProps {
            name: string
            email: string
          }
          defineProps<UserProfileProps>()
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
          interface Props {
            open: boolean
          }
          defineProps<Props>()
        </script>
      `,
      filename: "Modal.vue",
      output: `
        <script setup lang="ts">
          interface ModalProps {
            open: boolean
          }
          defineProps<ModalProps>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "Props",
            expectedPattern: "^ModalProps$",
            expectedName: "ModalProps",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "ModalProps" },
              output: `
        <script setup lang="ts">
          interface ModalProps {
            open: boolean
          }
          defineProps<ModalProps>()
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
          interface Props {
            modelValue: string
          }
          defineProps<Props>()
        </script>
      `,
      filename: "/src/components/forms/input-field.vue",
      output: `
        <script setup lang="ts">
          interface InputFieldProps {
            modelValue: string
          }
          defineProps<InputFieldProps>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "Props",
            expectedPattern: "^InputFieldProps$",
            expectedName: "InputFieldProps",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "InputFieldProps" },
              output: `
        <script setup lang="ts">
          interface InputFieldProps {
            modelValue: string
          }
          defineProps<InputFieldProps>()
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
          interface buttonProps {
            label: string
          }
          defineProps<buttonProps>()
        </script>
      `,
      filename: "button.vue",
      output: `
        <script setup lang="ts">
          interface ButtonProps {
            label: string
          }
          defineProps<ButtonProps>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "buttonProps",
            expectedPattern: "^ButtonProps$",
            expectedName: "ButtonProps",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "ButtonProps" },
              output: `
        <script setup lang="ts">
          interface ButtonProps {
            label: string
          }
          defineProps<ButtonProps>()
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
          interface ButtonProps { label: string }
          defineProps<ButtonProps>()
          
          interface WrongName { value: number }
          defineProps<WrongName>()
        </script>
      `,
      filename: "button.vue",
      output: `
        <script setup lang="ts">
          interface ButtonProps { label: string }
          defineProps<ButtonProps>()
          
          interface ButtonProps { value: number }
          defineProps<ButtonProps>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "WrongName",
            expectedPattern: "^ButtonProps$",
            expectedName: "ButtonProps",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "ButtonProps" },
              output: `
        <script setup lang="ts">
          interface ButtonProps { label: string }
          defineProps<ButtonProps>()
          
          interface ButtonProps { value: number }
          defineProps<ButtonProps>()
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
          interface ButtonProps {
            label: string
          }
          defineProps<ButtonProps>()
        </script>
      `,
      filename: "button.vue",
      options: [{ pattern: "^I{{FileName}}Props$" }],
      output: `
        <script setup lang="ts">
          interface IButtonProps {
            label: string
          }
          defineProps<IButtonProps>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "ButtonProps",
            expectedPattern: "^IButtonProps$",
            expectedName: "IButtonProps",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "IButtonProps" },
              output: `
        <script setup lang="ts">
          interface IButtonProps {
            label: string
          }
          defineProps<IButtonProps>()
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
            label: string
          }
          defineProps<IButton>()
        </script>
      `,
      filename: "button.vue",
      options: [{ pattern: "^I{{FileName}}Props$" }],
      output: `
        <script setup lang="ts">
          interface IButtonProps {
            label: string
          }
          defineProps<IButtonProps>()
        </script>
      `,
      errors: [
        {
          messageId: "issue:invalid-interface-name",
          data: {
            currentName: "IButton",
            expectedPattern: "^IButtonProps$",
            expectedName: "IButtonProps",
          },
          suggestions: [
            {
              messageId: "hint:rename-interface",
              data: { expectedName: "IButtonProps" },
              output: `
        <script setup lang="ts">
          interface IButtonProps {
            label: string
          }
          defineProps<IButtonProps>()
        </script>
      `,
            },
          ],
        },
      ],
    },
  ],
});
