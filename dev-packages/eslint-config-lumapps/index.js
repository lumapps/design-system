const extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue'];

const BASE_RULES = {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    '@typescript-eslint/no-use-before-define': ['error'],
    'default-param-last': 'off',
    'import/extensions': [
        'error',
        'never',
        {
            svg: 'always',
            scss: 'always',
            json: 'always',
        },
    ],
    'import/no-extraneous-dependencies': [
        'error',
        {
            devDependencies: ['**/*.test*', '**/*Tests.ts', '**/*.stories*', '**/testing/**', '**/stories/**'],
        },
    ],
    'indent': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'lumapps/do-not-import-all-lodash': 2,
    'no-continue': 'off',
    'no-plusplus': [
        'error',
        {
            allowForLoopAfterthoughts: true,
        },
    ],
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'spaced-comment': 'off',
};

const BASE_EXTENDS = ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'];

const BASE_PLUGINS = ['@typescript-eslint', 'import', 'lumapps'];

module.exports = {
    env: {
        jest: true,
        browser: true,
        es6: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        'import/resolver': { node: { extensions } },
        'import/extensions': extensions,
    },
    overrides: [
        {
            files: [
                'packages/lumx-react/**/*.{js,jsx,ts,tsx}',
                'packages/lumx-core/**/*.{js,jsx,ts,tsx}',
                'packages/site-demo/**/*.{js,jsx,ts,tsx}',
            ],
            extends: [
                'airbnb',
                'airbnb/hooks',
                'plugin:react/recommended',
                'plugin:react/jsx-runtime',
                ...BASE_EXTENDS,
            ],
            plugins: [...BASE_PLUGINS, 'react', 'jsx-a11y'],
            rules: {
                ...BASE_RULES,
                'react/default-props-match-prop-types': 'off',
                'react/destructuring-assignment': 'off',
                'react/display-name': 'off',
                'react/function-component-definition': 'off',
                'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
                'react/jsx-no-constructed-context-values': 'off',
                'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
                'react/jsx-props-no-spreading': 'off',
                'react/no-array-index-key': 'off',
                'react/prop-types': 'off',
                'react/require-default-props': 'off',
            },
        },
        {
            files: ['*/stories/*', '*.stories.tsx', '**/site-demo/content/**'],
            rules: {
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                'no-alert': 'off',
                'no-console': 'off',
                'jsx-a11y/anchor-is-valid': 'off',
                'react/no-unescaped-entities': 'off',
                'react/display-name': 'off',
            },
        },
        // TODO: remove theme switcher
        {
            files: ['**/MaterialThemeSwitcher/**'],
            extends: BASE_EXTENDS,
            rules: {
                ...BASE_RULES,
                'import/no-webpack-loader-syntax': 'off',
                'import/extensions': 'off',
            },
        },
        {
            files: ['packages/lumx-vue/**'],
            plugins: [...BASE_PLUGINS, 'vue'],
            extends: [...BASE_EXTENDS, 'plugin:vue/vue3-recommended', '@vue/eslint-config-typescript'],
            parserOptions: {
                project: ['./tsconfig.json'],
            },
            rules: {
                ...BASE_RULES,
                'import/extensions': [
                    'error',
                    'never',
                    {
                        svg: 'always',
                        scss: 'always',
                        json: 'always',
                        vue: 'always',
                    },
                ],
                'vue/html-self-closing': ['error', { html: { void: 'always', normal: 'always', component: 'always' } }],
                'vue/html-indent': ['error', 4],
                'vue/multi-word-component-names': 'off',
                "vue/block-order": ["error", {
                    "order": ["template", "script", "style"]
                }],
                "vue/max-attributes-per-line": ["error", {
                    "singleline": {
                        "max": 3
                    },
                    "multiline": {
                        "max": 3
                    }
                }],
                "vue/prop-name-casing": "off"
            },
        },
    ],
};
