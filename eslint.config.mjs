import globals from 'globals';
import tseslint from 'typescript-eslint';
import {defineConfig} from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  {files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], languageOptions: {globals: {...globals.browser, ...globals.node}}},
  stylistic.configs.customize({
      semi: true,
      severity: 'warn',
      quotes: 'single',
      quoteProps: 'as-needed',
      indent: 2,
      braceStyle: 'stroustrup',
      jsx: true,
      blockSpacing: true,
      commaDangle: 'only-multiline',
      arrowParens: true
    }
  ),
  ...tseslint.configs.stylistic, {
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@stylistic/jsx-one-expression-per-line': ['warn', {allow: 'single-line'}],
      '@stylistic/jsx-max-props-per-line': ['warn', {maximum: 2}],
      '@stylistic/jsx-pascal-case': 'error',
      '@stylistic/no-multi-spaces': [
        'warn', {
          ignoreEOLComments: true
        }
      ],
      '@stylistic/curly-newline': [
        'warn', {
          multiline: false,
          consistent: true
        }
      ]
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        projectService: true
      }
    },
    ignores:[
      "packages/core/lib-tauri",
      "**/dist/**",
      "**/.vite/**",
    ]
  }
]);
