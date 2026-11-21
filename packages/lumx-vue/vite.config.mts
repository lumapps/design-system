import { mergeConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';
import baseLibConfig, { lumxExternal, toPackageRegex } from '@lumx/base-vite-lib-config';

import pkg from './package.json' with { type: 'json' };

/** externalize */
const external = [
    // Vue (and its sub paths like `vue/jsx-runtime`)
    toPackageRegex('vue'),
    ...lumxExternal,
];

/**
 * Vite config
 *
 * (shared with Vitest and Storybook)
 */
export default mergeConfig(baseLibConfig({ pkg, external }), {
    plugins: [
        vue(),
        vueJsx({
            // 1. Tell the Vue JSX compiler what function to use (h)
            // 2. Tell it to import 'h' from the 'vue' module
            // The default setup in modern Vue JSX handles this, but explicitly
            // ensuring the right runtime is used is key.
            babelPlugins: [['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: 'vue' }]],
        }),
    ],
});
