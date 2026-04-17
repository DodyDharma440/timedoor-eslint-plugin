# Timedoor ESLint Plugin

This monorepo contains the ESLint tooling packages maintained by the **Timedoor Frontend Team** for Nuxt 3 + TypeScript projects.

## Packages

| Package | Version | Description |
| --- | --- | --- |
| [`eslint-plugin-tmdr-nuxt`](./packages/eslint-plugin-nuxt) | 1.x | ESLint plugin enforcing Nuxt.js best practices, TypeScript conventions, and directory structure standards |
| [`eslint-config-tmdr-nuxt`](./packages/eslint-config-nuxt) | 1.x (classic config) / 2.x (flat config) | Shared ESLint config that bundles the plugin with a curated set of community plugins |

## Documentation

Full documentation is available at **[timedoor-eslint-plugin-nuxt.vercel.app](https://timedoor-eslint-plugin-nuxt.vercel.app/)**.

## Repository Structure

```bash
docs/                   # Docusaurus documentation site
examples/
  flat-config/          # Example Nuxt 3 project using ESLint flat config (v9+)
  classic/              # Example Nuxt 3 project using classic .eslintrc config (v8)
packages/
  eslint-plugin-nuxt/   # eslint-plugin-tmdr-nuxt
  eslint-config-nuxt/   # eslint-config-tmdr-nuxt
scripts/                # Release and build automation
```

## Development

This repo uses [pnpm workspaces](https://pnpm.io/workspaces).

```bash
pnpm install
```

Build all packages:

```bash
pnpm build
```
