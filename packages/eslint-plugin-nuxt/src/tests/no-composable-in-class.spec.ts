import { noComposableInClass } from "../rules/no-composable-in-class";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("no-composable-in-class", noComposableInClass, {
  // ============================================================================
  // VALID TEST CASES
  // Case that should PASS validation
  // ============================================================================
  valid: [
    // Composable called at the top-level script — not inside any class
    {
      code: `
        <script setup lang="ts">
          const route = useRoute()
        </script>
      `,
      filename: "ValidTopLevel.vue",
    },
    // useCookie inside a class — in the default allowedComposables list
    {
      code: `
        <script setup lang="ts">
          class TokenService {
            getToken() {
              return useCookie('token')
            }
          }
        </script>
      `,
      filename: "ValidDefaultAllowedUseCookie.vue",
    },
    // useNuxtApp inside a class constructor — in the default allowedComposables list
    {
      code: `
        <script setup lang="ts">
          class AppService {
            constructor() {
              this.app = useNuxtApp()
            }
          }
        </script>
      `,
      filename: "ValidDefaultAllowedUseNuxtApp.vue",
    },
    // Both default-allowed composables used together inside a class
    {
      code: `
        <script setup lang="ts">
          class MyService {
            init() {
              const cookie = useCookie('flag')
              const app = useNuxtApp()
            }
          }
        </script>
      `,
      filename: "ValidBothDefaultAllowed.vue",
    },
    // useStore added via allowedComposables, overrideDefaults: false (merged with defaults)
    {
      code: `
        <script setup lang="ts">
          class CartService {
            load() {
              const store = useStore()
            }
          }
        </script>
      `,
      filename: "ValidMergedCustomAllowed.vue",
      options: [{ allowedComposables: ["useStore"], overrideDefaults: false }],
    },
    // overrideDefaults: false — defaults still apply alongside custom list
    // useCookie (default) and useStore (custom) are both allowed
    {
      code: `
        <script setup lang="ts">
          class MyService {
            init() {
              const store = useStore()
              const cookie = useCookie('flag')
            }
          }
        </script>
      `,
      filename: "ValidMergedDefaultsStillApply.vue",
      options: [{ allowedComposables: ["useStore"], overrideDefaults: false }],
    },
    // overrideDefaults: true with useRoute explicitly in list — only useRoute is allowed
    {
      code: `
        <script setup lang="ts">
          class NavService {
            navigate() {
              const route = useRoute()
            }
          }
        </script>
      `,
      filename: "ValidOverrideDefaultsWithCustom.vue",
      options: [{ allowedComposables: ["useRoute"], overrideDefaults: true }],
    },
    // Non-composable function calls inside a class — not matched by use[A-Z] regex
    {
      code: `
        <script setup lang="ts">
          class MyService {
            process() {
              fetchData()
              formatValue(val)
            }
          }
        </script>
      `,
      filename: "ValidNonComposableInClass.vue",
    },
    // Composable inside a plain function (not a class) — always safe
    {
      code: `
        <script setup lang="ts">
          function setup() {
            const route = useRoute()
          }
        </script>
      `,
      filename: "ValidComposableInPlainFunction.vue",
    },
  ],

  // ============================================================================
  // INVALID TEST CASES
  // Case that should FAIL and trigger ESLint errors
  // ============================================================================
  invalid: [
    // useRoute inside a class method — not in default allowedComposables
    {
      code: `
        <script setup lang="ts">
          class MyService {
            navigate() {
              const route = useRoute()
            }
          }
        </script>
      `,
      filename: "InvalidUseRouteInMethod.vue",
      errors: [
        {
          messageId: "issue:composable-call",
          data: { name: "useRoute" },
        },
      ],
    },
    // useState inside a class constructor — not in default allowedComposables
    {
      code: `
        <script setup lang="ts">
          class CounterService {
            constructor() {
              this.count = useState('count', () => 0)
            }
          }
        </script>
      `,
      filename: "InvalidUseStateInConstructor.vue",
      errors: [
        {
          messageId: "issue:composable-call",
          data: { name: "useState" },
        },
      ],
    },
    // useFetch inside a static class method — not in default allowedComposables
    {
      code: `
        <script setup lang="ts">
          class DataService {
            static async load() {
              const { data } = await useFetch('/api/items')
            }
          }
        </script>
      `,
      filename: "InvalidUseFetchInStaticMethod.vue",
      errors: [
        {
          messageId: "issue:composable-call",
          data: { name: "useFetch" },
        },
      ],
    },
    // useRouter inside a class expression — not in default allowedComposables
    {
      code: `
        <script setup lang="ts">
          const NavService = class {
            goHome() {
              useRouter().push('/')
            }
          }
        </script>
      `,
      filename: "InvalidComposableInClassExpression.vue",
      errors: [
        {
          messageId: "issue:composable-call",
          data: { name: "useRouter" },
        },
      ],
    },
    // Multiple non-allowed composables in the same class — two errors
    {
      code: `
        <script setup lang="ts">
          class MyService {
            init() {
              const route = useRoute()
              const router = useRouter()
            }
          }
        </script>
      `,
      filename: "InvalidMultipleComposablesInClass.vue",
      errors: [
        {
          messageId: "issue:composable-call",
          data: { name: "useRoute" },
        },
        {
          messageId: "issue:composable-call",
          data: { name: "useRouter" },
        },
      ],
    },
    // overrideDefaults: true with empty list — useCookie (a default) is now forbidden
    {
      code: `
        <script setup lang="ts">
          class TokenService {
            get() {
              return useCookie('token')
            }
          }
        </script>
      `,
      filename: "InvalidUseCookieOverrideDefaults.vue",
      options: [{ allowedComposables: [], overrideDefaults: true }],
      errors: [
        {
          messageId: "issue:composable-call",
          data: { name: "useCookie" },
        },
      ],
    },
    // overrideDefaults: true with only useStore allowed — useNuxtApp (a default) is forbidden
    {
      code: `
        <script setup lang="ts">
          class AppService {
            constructor() {
              this.app = useNuxtApp()
            }
          }
        </script>
      `,
      filename: "InvalidUseNuxtAppOverrideDefaults.vue",
      options: [{ allowedComposables: ["useStore"], overrideDefaults: true }],
      errors: [
        {
          messageId: "issue:composable-call",
          data: { name: "useNuxtApp" },
        },
      ],
    },
    // useRoute inside a nested arrow function inside a class — still inside class scope
    {
      code: `
        <script setup lang="ts">
          class MyService {
            setup() {
              const inner = () => {
                const route = useRoute()
              }
            }
          }
        </script>
      `,
      filename: "InvalidComposableInNestedArrow.vue",
      errors: [
        {
          messageId: "issue:composable-call",
          data: { name: "useRoute" },
        },
      ],
    },
  ],
});
