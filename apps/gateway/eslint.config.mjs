import tsParser from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const typescriptOptions = {
  files: ['**/*.ts'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: ['tsconfig.json'],
    },
    sourceType: 'module',
    ecmaVersion: 'latest',
    globals: {
      ...globals.node,
    },
  },
  plugins: {
    '@typescript-eslint': tsEslintPlugin,
    prettier,
    import: importPlugin,
  },
  rules: {
    'prettier/prettier': 'error',

    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: false },
    ],

    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'off',

    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',

    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.name='ManyToMany']",
        message: 'ManyToMany decorator is restricted.',
      },
    ],
  },
};

export default [typescriptOptions];
