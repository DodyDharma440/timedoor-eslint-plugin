# Timedoor ESLint Config

`eslint-config-tmdr-nuxt` is a shared ESLint configuration that bundles `eslint-plugin-tmdr-nuxt` together with a curated set of community plugins suitable for Nuxt 3 + TypeScript projects.

## What's included

| Plugin | Purpose |
| --- | --- |
| `eslint-plugin-tmdr-nuxt` | All Timedoor Nuxt rules (see Rules section) |
| `@typescript-eslint` | TypeScript-aware linting |
| `eslint-plugin-vue` | Vue SFC linting |
| `eslint-plugin-import` | Import ordering and resolution |
| `eslint-plugin-promise` | Promise best practices |
| `eslint-plugin-sonarjs` | Code quality and complexity |
| `eslint-plugin-regexp` | Regular expression correctness |
| `eslint-plugin-case-police` | Enforces proper casing for known identifiers |

## Installation

```bash
npm install --save-dev eslint-config-tmdr-nuxt
# or
pnpm add -D eslint-config-tmdr-nuxt
# or
yarn add -D eslint-config-tmdr-nuxt
```

## Usage

Choose a setup guide based on your ESLint version:

- [**Flat Config**](https://timedoor-eslint-plugin-nuxt.vercel.app/eslint-config/flat-config) — ESLint v9+ (recommended)
- [**Classic Config**](https://timedoor-eslint-plugin-nuxt.vercel.app/eslint-config/classic-config) — ESLint v8 (legacy)
