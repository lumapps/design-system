import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig, type Plugin } from 'vite';
import path from 'node:path';
import { generateReactDemoStories } from '../../site-demo/scripts/generate-demo-stories.mjs';

const importUrl = new URL(import.meta.url);
const postcss = path.join('../..', importUrl.pathname, 'configs');

// Vite 8's default (modern) Sass compiler no longer resolves bare `@import`
// statements (e.g. `@import "sass-mq"`) from `node_modules` automatically.
// Provide a resolver-based importer so the legacy-style `@import`s in the LumX
// SCSS keep working (mirrors the importer used in lumx-core/vite.config.mts).
const sassImporters = [{ findFileUrl: (url: string) => new URL(import.meta.resolve(url)) }];

const config: StorybookConfig = {
    addons: ['@storybook/addon-a11y'],
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: ['../../site-demo/static/'],
    framework: '@storybook/react-vite',
    core: {
        disableWhatsNewNotifications: true,
    },

    async viteFinal(config) {
        return mergeConfig(config, {
            css: {
                postcss,
                preprocessorOptions: {
                    scss: { importers: sassImporters },
                },
            },
            plugins: [
                {
                    name: 'generate-demo-stories',
                    async buildStart() {
                        await generateReactDemoStories(this.info.bind(this));
                    },
                } satisfies Plugin,
            ],
        });
    },
};
export default config;
