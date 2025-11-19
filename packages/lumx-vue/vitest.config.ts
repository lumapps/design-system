import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
        alias: {
            '@lumx/icons': path.resolve(__dirname, '../lumx-icons/dist'),
        },
        setupFiles: ['./vitest.setup.ts'],
    },
    plugins: [
        vue(),
        vueJsx({
            // 1. Tell the Vue JSX compiler what function to use (h)
            // 2. Tell it to import 'h' from the 'vue' module
            // The default setup in modern Vue JSX handles this, but explicitly
            // ensuring the right runtime is used is key.
            babelPlugins: [['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: 'vue' }]],
        }),
        tsconfigPaths(),
    ],
});
