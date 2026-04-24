const eslintPluginImport = require('eslint-plugin-import');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
