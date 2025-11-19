/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import pkg from './package.json';

import copy from 'rollup-plugin-copy';

export default defineConfig({
    plugins: [vue(), tsconfigPaths()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'LumxVue',
            fileName: () => 'index.js',
            formats: ['es'],
        },
        outDir: 'dist',
        rollupOptions: {
            external: (id) =>
                (id !== 'vue-demi' && Object.keys(pkg.peerDependencies || {}).includes(id)) ||
                Object.keys(pkg.dependencies || {}).includes(id),
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
            plugins: [
                copy({
                    targets: [
                        { src: 'package.json', dest: 'dist' },
                        { src: 'src/**/*', dest: 'dist/src' },
                    ],
                    hook: 'writeBundle',
                }),
            ],
        },
    },
});
