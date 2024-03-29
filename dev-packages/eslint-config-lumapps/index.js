module.exports = {
    env: {
        jest: true,
        browser: true,
        es6: true,
    },
    extends: [
        'airbnb',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'prettier'
    ],
    globals: {
        angular: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'jsx-a11y',
        'import',
        'lumapps',
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: [
                    '.js',
                    '.ts',
                    '.jsx',
                    '.tsx',
                    '.json',
                ],
            },
        },
        'import/extensions': [
            '.js',
            '.ts',
            '.mjs',
            '.jsx',
            '.tsx',
        ],
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true }],
        '@typescript-eslint/no-use-before-define': ['error'],
        'arrow-body-style': 'off',
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
                devDependencies: [
                    '**/*.test*',
                    '**/*.stories*',
                    '**/testing/**',
                    '**/stories/**',
                ],
            },
        ],
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
        'no-restricted-syntax': [
            'error',
            'ForInStatement',
            'LabeledStatement',
            'WithStatement',
        ],
        'no-shadow': 'off',
        'no-underscore-dangle': 'off',
        'no-use-before-define': 'off',
        quotes: ['error', 'single', 'avoid-escape'],
        'react/default-props-match-prop-types': 'off',
        'react/destructuring-assignment': 'off',
        'react/display-name': 'off',
        'react/function-component-definition': 'off',
        'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'react/jsx-no-constructed-context-values': 'off',
        'react/jsx-no-useless-fragment': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/no-array-index-key': 'off',
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'spaced-comment': 'off',
    },
    overrides: [
        {
            files: ['*/stories/*', '*.stories.tsx', '**/site-demo/content/**'],
            rules: {
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                'no-alert': 'off',
                'no-console': 'off',
            },
        },
        // TODO: remove theme switcher
        {
            files: ['**/MaterialThemeSwitcher/**'],
            rules: {
                'import/no-webpack-loader-syntax': 'off',
                'import/extensions': 'off',
            }
        }
    ],
};
