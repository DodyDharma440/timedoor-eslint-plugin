import { noManualRepositoryImport } from "../rules/no-manual-repository-import";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("no-manual-repository-import", noManualRepositoryImport, {
  // ============================================================================
  // VALID TEST CASES
  // Cases that should PASS validation (no error reported)
  // ============================================================================
  valid: [
    // File is located in an "allowed" directory (plugins) -> importing from repository is permitted
    {
      filename: "plugins/my-plugin.vue",
      code: `
          <script setup>
          import { userRepo } from '@/repository/modules/user'
          import { postRepo } from '~/repositories/modules/post'
          </script>
        `,
    },
    // File is located in a nested allowed directory
    {
      filename: "src/plugins/auth/service.vue",
      code: `
          <script setup>
          import { repo } from '@/repositories/modules/data'
          </script>
        `,
    },
    // Import from a path that does not contain any forbidden directory segments
    {
      filename: "components/UserCard.vue",
      code: `
          <script setup>
          import { helper } from '@/utils/helper'
          import { api } from '@/services/api'
          import { store } from '@/stores/user'
          </script>
        `,
    },
    // Import containing forbidden words but NOT as a directory segment
    {
      filename: "components/List.vue",
      code: `
          <script setup>
          import { repositoryHelper } from '@/utils/functions'
          import config from '@/config/repository-settings'
          import { factory } from '@/services/repository-factory'
          </script>
        `,
    },
    // External package imports (no slash after the keyword)
    {
      filename: "components/Test.vue",
      code: `
          <script setup>
          import { something } from 'repository-package'
          import lodash from 'lodash/repositories'
          </script>
        `,
    },
    // Relative imports that do not contain forbidden path segments
    {
      filename: "components/Test.vue",
      code: `
          <script setup>
          import { util } from '../utils/helper'
          import { config } from './config'
          </script>
        `,
    },
    // Custom options: user defines their own allowedDirsToImport
    {
      filename: "src/services/api-client.vue",
      options: [
        { forbiddenPaths: ["repository/modules"], overrideDefaults: false },
        { allowedDirsToImport: ["services"], overrideDefaults: true },
      ],
      code: `
          <script setup>
          import { repo } from '@/repository/modules/user'
          </script>
        `,
    },
    // Custom options: user overrides forbiddenPaths
    {
      filename: "components/Test.vue",
      options: [
        { forbiddenPaths: ["custom/repo"], overrideDefaults: true },
        { allowedDirsToImport: ["plugins"], overrideDefaults: false },
      ],
      code: `
          <script setup>
          import { repo } from '@/repository/modules/user'
          </script>
        `,
    },
    // Custom options: both forbiddenPaths and allowedDirsToImport customized
    {
      filename: "src/custom-dir/component.vue",
      options: [
        { forbiddenPaths: ["data/store"], overrideDefaults: true },
        { allowedDirsToImport: ["custom-dir"], overrideDefaults: true },
      ],
      code: `
          <script setup>
          import { repo } from '@/data/store/user'
          </script>
        `,
    },
  ],

  // ============================================================================
  // INVALID TEST CASES
  // Cases that should FAIL and trigger ESLint errors
  // ============================================================================
  invalid: [
    // Direct import from repository/modules directory using @ alias
    {
      filename: "components/UserCard.vue",
      code: `
          <script setup>
          import { userRepo } from '@/repository/modules/user'
          </script>
        `,
      errors: [{ messageId: "issue:manual-import" }],
    },
    // Import from repositories/modules directory (plural form)
    {
      filename: "pages/posts.vue",
      code: `
          <script setup>
          import { postRepo } from '@/repositories/modules/post'
          </script>
        `,
      errors: [{ messageId: "issue:manual-import" }],
    },
    // Import from repository/module (singular)
    {
      filename: "pages/index.vue",
      code: `
          <script setup>
          import { config } from '@/repository/module'
          </script>
        `,
      errors: [{ messageId: "issue:manual-import" }],
    },
    // Import from repositories/module (singular plural)
    {
      filename: "pages/list.vue",
      code: `
          <script setup>
          import { config } from '@/repositories/module'
          </script>
        `,
      errors: [{ messageId: "issue:manual-import" }],
    },
    // Relative path import containing a forbidden directory segment
    {
      filename: "components/List.vue",
      code: `
          <script setup>
          import { data } from '../../repository/modules/data'
          </script>
        `,
      errors: [{ messageId: "issue:manual-import" }],
    },
    // Multiple forbidden imports in a single file
    {
      filename: "components/Multi.vue",
      code: `
          <script setup>
          import { userRepo } from '@/repository/modules/user'
          import { postRepo } from '~/repositories/modules/post'
          </script>
        `,
      errors: [
        { messageId: "issue:manual-import" },
        { messageId: "issue:manual-import" },
      ],
    },
    // Import using tilde alias (~)
    {
      filename: "composables/useData.vue",
      code: `
          <script setup>
          import { repo } from '~/repository/modules/helper'
          </script>
        `,
      errors: [{ messageId: "issue:manual-import" }],
    },
    // Import from a nested component directory
    {
      filename: "src/components/ui/Table/Table.vue",
      code: `
          <script setup>
          import { db } from '@/repositories/modules/database'
          </script>
        `,
      errors: [{ messageId: "issue:manual-import" }],
    },
    // Custom options: file NOT in allowed directory, import forbidden path
    {
      filename: "components/Test.vue",
      options: [
        { forbiddenPaths: ["repository/modules"], overrideDefaults: false },
        { allowedDirsToImport: ["services"], overrideDefaults: true },
      ],
      code: `
          <script setup>
          import { repo } from '@/repository/modules/user'
          </script>
        `,
      errors: [{ messageId: "issue:manual-import" }],
    },
    // Custom options: custom forbidden path triggered
    {
      filename: "pages/Test.vue",
      options: [
        { forbiddenPaths: ["custom/repo"], overrideDefaults: true },
        { allowedDirsToImport: ["plugins"], overrideDefaults: false },
      ],
      code: `
          <script setup>
          import { repo } from '@/custom/repo/data'
          </script>
        `,
      errors: [{ messageId: "issue:manual-import" }],
    },
    // Custom options: custom allowed dir and forbidden path
    {
      filename: "plugins/Test.vue",
      options: [
        { forbiddenPaths: ["special/data"], overrideDefaults: true },
        { allowedDirsToImport: ["utils"], overrideDefaults: true },
      ],
      code: `
          <script setup>
          import { repo } from '@/special/data/user'
          </script>
        `,
      errors: [{ messageId: "issue:manual-import" }],
    },
  ],
});
