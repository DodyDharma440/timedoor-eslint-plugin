import { requireTypedRepository } from "../rules/require-typed-repository";
import { createVueTester } from "../utils/tester";

const ruleTester = createVueTester();

ruleTester.run("require-typed-repository", requireTypedRepository, {
  // ============================================================================
  // VALID TEST CASES
  // Cases that should PASS validation
  // ============================================================================
  valid: [
    // Method with generic ApiResponse return type and typed parameters
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async getUser(id: string): Promise<ApiResponse<User>> {
            return api.get<User>(\`/users/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
    },

    // Method with multiple typed parameters
    {
      code: `
        <script lang="ts">
        class ProductRepository {
          async searchProducts(
            query: string, 
            page: number
          ): Promise<ApiResponse<Product[]>> {
            return api.get<Product[]>(\`/products?query=\${query}&page=\${page}\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/product.repository.ts",
    },

    // Method with PaginationResponse return type
    {
      code: `
        <script lang="ts">
        class OrderRepository {
          async listOrders(
            filter: OrderFilter
          ): Promise<PaginationResponse<Order>> {
            return api.get<PaginationResponse<Order>>('/orders', { filter });
          }
        }
        </script>
      `,
      filename: "src/repository/modules/order.repository.ts",
    },

    // Method with union/intersection type parameters
    {
      code: `
        <script lang="ts">
        class AuthRepository {
          async login(
            credentials: { email: string; password: string } | LoginRequest
          ): Promise<ApiResponse<AuthToken>> {
            return api.post<AuthToken>('/auth/login', credentials);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/auth.repository.ts",
    },

    // Method without parameters but with typed return - VALID
    {
      code: `
        <script lang="ts">
        class ConfigRepository {
          async getAppConfig(): Promise<ApiResponse<AppConfig>> {
            return api.get<AppConfig>('/config');
          }
        }
        </script>
      `,
      filename: "src/repository/modules/config.repository.ts",
    },

    // Method with generic type parameter
    {
      code: `
        <script lang="ts">
        class BaseRepository<T> {
          async findById(id: string): Promise<ApiResponse<T>> {
            return api.get<T>(\`/resource/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/base.repository.ts",
    },

    // Method with optional typed parameter
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async updateUser(
            id: string,
            data?: Partial<User>
          ): Promise<ApiResponse<User>> {
            return api.patch<User>(\`/users/\${id}\`, data);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
    },

    // Method with rest parameter that has typed array
    {
      code: `
        <script lang="ts">
        class BatchRepository {
          async createMany(
            ...items: CreateUserDto[]
          ): Promise<ApiResponse<User[]>> {
            return api.post<User[]>('/users/batch', items);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/batch.repository.ts",
    },

    // Method returning custom generic wrapper (still typed)
    {
      code: `
        <script lang="ts">
        class CustomRepository {
          async fetch<T>(endpoint: string): Promise<CustomResponse<T>> {
            return api.get<CustomResponse<T>>(endpoint);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/custom.repository.ts",
    },

    // Non-repository file should be ignored by targetDirectory pattern
    {
      code: `
        <script lang="ts">
        class UserService {
          async getUser(id) {
            return this.repo.getUser(id);
          }
        }
        </script>
      `,
      filename: "src/services/user.service.ts",
    },

    // Arrow function property with typed params and return - VALID
    {
      code: `
        <script lang="ts">
        class UserRepository {
          getUser = async (id: string): Promise<ApiResponse<User>> => {
            return api.get<User>(\`/users/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
    },

    // Method with repositories (plural) path - VALID
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async getUser(id: string): Promise<ApiResponse<User>> {
            return api.get<User>(\`/users/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repositories/modules/user.repository.ts",
    },
  ],

  // ============================================================================
  // INVALID TEST CASES
  // Cases that should FAIL and trigger ESLint errors
  // ============================================================================
  invalid: [
    // Method without return type annotation
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async getUser(id: string) {
            return api.get<User>(\`/users/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-return",
          data: { methodName: "getUser", classAttr: "method" },
        },
      ],
    },

    // Method with direct any return type
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async getUser(id: string): any {
            return api.get(\`/users/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-any-return",
          data: { classAttr: "method" },
        },
      ],
    },

    // Method with Promise<any> return type
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async getUser(id: string): Promise<any> {
            return api.get(\`/users/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-any-return",
          data: { classAttr: "method" },
        },
      ],
    },

    // Method with direct void return type
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async logAction(action: string): void {
            console.log(action);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-any-return",
          data: { classAttr: "method" },
        },
      ],
    },

    // Method with Promise<void> return type
    {
      code: `
        <script lang="ts">
        class NotificationRepository {
          async markAsRead(id: string): Promise<void> {
            return api.post(\`/notifications/\${id}/read\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/notification.repository.ts",
      errors: [
        {
          messageId: "issue:no-any-return",
          data: { classAttr: "method" },
        },
      ],
    },

    // Parameter without type annotation (implicit any)
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async getUser(id): Promise<ApiResponse<User>> {
            return api.get<User>(\`/users/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-param",
          data: { methodName: "getUser", classAttr: "method" },
        },
      ],
    },

    // Parameter with explicit any type
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async searchUsers(query: any): Promise<ApiResponse<User[]>> {
            return api.get<User[]>('/users', { query });
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-any-param",
          data: { classAttr: "method" },
        },
      ],
    },

    // Multiple errors: missing return type and untyped parameters
    {
      code: `
        <script lang="ts">
        class ProductRepository {
          async createProduct(name, description) {
            return api.post('/products', { name, description });
          }
        }
        </script>
      `,
      filename: "src/repository/modules/product.repository.ts",
      errors: [
        {
          messageId: "issue:no-return",
          data: { methodName: "createProduct", classAttr: "method" },
        },
        {
          messageId: "issue:no-param",
          data: { methodName: "createProduct", classAttr: "method" },
        },
        {
          messageId: "issue:no-param",
          data: { methodName: "createProduct", classAttr: "method" },
        },
      ],
    },

    // Mixed scenario: one typed parameter, one with any type
    {
      code: `
        <script lang="ts">
        class OrderRepository {
          async updateOrder(
            id: string, 
            updates: any
          ): Promise<ApiResponse<Order>> {
            return api.patch<Order>(\`/orders/\${id}\`, updates);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/order.repository.ts",
      errors: [
        {
          messageId: "issue:no-any-param",
          data: { classAttr: "method" },
        },
      ],
    },

    // Optional parameter without type annotation
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async updateUser(id: string, data?): Promise<ApiResponse<User>> {
            return api.patch<User>(\`/users/\${id}\`, data);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-param",
          data: { methodName: "updateUser", classAttr: "method" },
        },
      ],
    },

    // Rest parameter without type annotation
    {
      code: `
        <script lang="ts">
        class BatchRepository {
          async createMany(...items): Promise<ApiResponse<User[]>> {
            return api.post<User[]>('/users/batch', items);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/batch.repository.ts",
      errors: [
        {
          messageId: "issue:no-param",
          data: { methodName: "createMany", classAttr: "method" },
        },
      ],
    },

    // Rest parameter with any[] type
    {
      code: `
        <script lang="ts">
        class BatchRepository {
          async createMany(...items: any[]): Promise<ApiResponse<User[]>> {
            return api.post<User[]>('/users/batch', items);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/batch.repository.ts",
      errors: [
        {
          messageId: "issue:no-any-param",
          data: { classAttr: "method" },
        },
      ],
    },

    // Arrow function property without return type
    {
      code: `
        <script lang="ts">
        class UserRepository {
          getUser = async (id: string) => {
            return api.get<User>(\`/users/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-return",
          data: { methodName: "getUser", classAttr: "property function" },
        },
      ],
    },

    // Arrow function property with untyped parameter
    {
      code: `
        <script lang="ts">
        class UserRepository {
          getUser = async (id): Promise<ApiResponse<User>> => {
            return api.get<User>(\`/users/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-param",
          data: { methodName: "getUser", classAttr: "property function" },
        },
      ],
    },

    // Arrow function property with any parameter
    {
      code: `
        <script lang="ts">
        class UserRepository {
          searchUsers = async (query: any): Promise<ApiResponse<User[]>> => {
            return api.get<User[]>('/users', { query });
          }
        }
        </script>
      `,
      filename: "src/repository/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-any-param",
          data: { classAttr: "property function" },
        },
      ],
    },

    // Method in repositories (plural) path without return type
    {
      code: `
        <script lang="ts">
        class UserRepository {
          async getUser(id: string) {
            return api.get<User>(\`/users/\${id}\`);
          }
        }
        </script>
      `,
      filename: "src/repositories/modules/user.repository.ts",
      errors: [
        {
          messageId: "issue:no-return",
          data: { methodName: "getUser", classAttr: "method" },
        },
      ],
    },
  ],
});
