# Timedoor ESLint Plugin

`eslint-plugin-tmdr-nuxt` is an ESLint plugin designed for the Timedoor Frontend Team. It enforces **Nuxt.js best practices**, **TypeScript conventions**, and **directory structure** standards in Nuxt 3 projects.

There is also a ready-to-use shared config, [`eslint-config-tmdr-nuxt`](./eslint-config), that bundles this plugin alongside other recommended plugins.

## Installation

### Plugin only

```bash
npm install --save-dev eslint-plugin-tmdr-nuxt
# or
pnpm add -D eslint-plugin-tmdr-nuxt
# or
yarn add -D eslint-plugin-tmdr-nuxt
```

### Shared config (recommended)

The shared config includes `eslint-plugin-tmdr-nuxt` plus a curated set of other ESLint plugins. See the [ESLint Config](https://timedoor-eslint-plugin-nuxt.vercel.app/eslint-config) page for full details.

## Usage

### Flat Config (`eslint.config.mjs`)

```js
import pluginTmdrNuxt from 'eslint-plugin-tmdr-nuxt'

export default [
  {
    plugins: {
      'tmdr-nuxt': pluginTmdrNuxt,
    },
    rules: {
      'tmdr-nuxt/no-composable-in-class': 'error',
      'tmdr-nuxt/async-data-top-level': 'error',
      // ... add more rules
    },
  },
]
```

Or use the built-in `recommended` config to enable all rules at once:

```js
import pluginTmdrNuxt from 'eslint-plugin-tmdr-nuxt'

export default [
  {
    plugins: { 'tmdr-nuxt': pluginTmdrNuxt },
    ...pluginTmdrNuxt.configs.recommended,
  },
]
```

### Legacy Config (`.eslintrc`)

```json
{
  "plugins": ["tmdr-nuxt"],
  "rules": {
    "tmdr-nuxt/no-composable-in-class": "error",
    "tmdr-nuxt/async-data-top-level": "error"
  }
}
```

Or extend the `recommended` config:

```json
{
  "extends": ["plugin:tmdr-nuxt/recommended"]
}
```
