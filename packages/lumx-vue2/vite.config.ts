import { defineConfig, mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import vueJsx from '@vitejs/plugin-vue2-jsx';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const classNameToClass = function ({ types: t }: any) {
  return {
    visitor: {
      JSXAttribute(path: any) {
        if (path.node.name.name === 'className') {
          path.node.name.name = 'class';
        }
      },
    },
  };
};

export default defineConfig((config) =>
  mergeConfig(config, {
    plugins: [
      vue(),
      tsconfigPaths(),
      vueJsx({
        babelPlugins: [classNameToClass],
      }),
      viteStaticCopy({
        targets: [
          { src: 'package.json', dest: '' },
          { src: 'README.md', dest: '' },
        ],
      }),
    ],
    optimizeDeps: { include: ['@lumx/icons'] },
    resolve: {
      alias: {
        '@vue/babel-helper-vue-jsx-merge-props': path.resolve(__dirname, 'node_modules/@vue/babel-helper-vue-jsx-merge-props'),
      },
    },
    build: {
      lib: {
        entry: './src/index.ts',
        name: 'LumxVue2',
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
