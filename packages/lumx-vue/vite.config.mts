import path from 'path';

import { mergeConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';
import baseLibConfig from '@lumx/base-vite-lib-config';

import pkg from './package.json' with { type: 'json' };
import lumxCorePkg from '../lumx-core/package.json' with { type: 'json' };

/** externalize */
const external = [
    // Vue
    'vue',
    // @lumx/core exports — externalize exact re-export paths
    ...Object.keys(lumxCorePkg.exports).map((subpath) => path.join('@lumx/core', subpath)),
    // @lumx/icons
    /^@lumx\/icons(\/.*)?/,
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
