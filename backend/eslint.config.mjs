// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import * as importPlugin from 'eslint-plugin-import';

export default tseslint.config(
    {
        ignores: ['eslint.config.mjs'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'commonjs',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            'indent': 'off',
            'function-call-argument-newline': ['error', 'consistent'],
            'function-paren-newline': ['error', 'consistent'],
            'array-element-newline': ['error', 'consistent'],
            'array-bracket-newline': ['error', 'consistent'],
            'object-curly-newline': ['error', { 'consistent': true }],
            'object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': true }],
            'max-len': ['error', { 'code': 120, 'ignoreComments': true, 'ignoreUrls': true, 'ignoreStrings': true, 'ignoreTemplateLiterals': true, 'ignoreRegExpLiterals': true }],
            'padding-line-between-statements': [
                'error',
                { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
                { 'blankLine': 'always', 'prev': ['const', 'let', 'var'], 'next': '*' },
                { 'blankLine': 'any', 'prev': ['const', 'let', 'var'], 'next': ['const', 'let', 'var'] },
                { 'blankLine': 'always', 'prev': '*', 'next': 'if' },
                { 'blankLine': 'always', 'prev': 'if', 'next': '*' },
                { 'blankLine': 'always', 'prev': '*', 'next': 'expression' },
                { 'blankLine': 'any', 'prev': 'expression', 'next': 'expression' }
            ],
            'prettier/prettier': ['error', {
                'printWidth': 120
            }],
            'import/order': ['error', {
                'groups': [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'index',
                    'sibling'
                ],
                'pathGroups': [
                    {
                        'pattern': '@/modules/**',
                        'group': 'internal',
                        'position': 'before'
                    }
                ],
                'newlines-between': 'always',
                'alphabetize': {
                    'order': 'asc',
                    'caseInsensitive': true
                }
            }],
            'import/no-duplicates': 'error',
            'import/no-cycle': 'error'
        },
    },
);
