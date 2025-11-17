import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import pkg from './package.json';

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'LumxVue',
            fileName: (format) => `index.${format}.js`,
        },
        outDir: 'dist',
        rollupOptions: {
            external: (id) =>
                (id !== 'vue-demi' && Object.keys(pkg.peerDependencies || {}).includes(id)) ||
                Object.keys(pkg.dependencies || {}).includes(id) ||
                id.startsWith('@lumx/core'),
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
});
