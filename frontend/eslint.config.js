import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'import': importPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: path.resolve(__dirname, './tsconfig.app.json'),
                },
            },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            indent: ['error', 4],
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'import/order': ['error', {
                'groups': [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index'
                ],
                'newlines-between': 'always',
                'alphabetize': {
                    'order': 'asc',
                    'caseInsensitive': true
                }
            }],
            'import/no-duplicates': 'error',
            'import/no-unresolved': 'error',
            'import/no-cycle': 'error'
        },
    }
);
