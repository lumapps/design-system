import { defineConfig, mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig((config) =>
  mergeConfig(config, {
    plugins: [
      vue(),
      vueJsx({
        babelPlugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: 'vue' }],
        ],
      }),
      tsconfigPaths(),
    ],
    optimizeDeps: { include: ['@lumx/icons'] },
    build: {
      lib: {
        entry: './src/index.ts',
        name: 'LumxVue',
        fileName: 'index',
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['vue', '@lumx/icons', '@lumx/core'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  })
);
