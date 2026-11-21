import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig, type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { generateVueDemoStories } from '@lumx/generate-demo-stories/generate-demo-stories.mjs';

const importUrl = new URL(import.meta.url);
const postcss = path.join('../..', importUrl.pathname, 'configs');

// Vite 8's default (modern) Sass compiler no longer resolves bare `@import`
// statements (e.g. `@import "sass-mq"`) from `node_modules` automatically.
// Provide a resolver-based importer so the legacy-style `@import`s in the LumX
// SCSS keep working (mirrors the importer used in lumx-core/vite.config.mts).
const sassImporters = [{ findFileUrl: (url: string) => new URL(import.meta.resolve(url)) }];

/**
 * Vite resolves the tsconfig `paths` natively, but only for files that their nearest tsconfig.json
 * includes. The site-demo tsconfig.json excludes `*.vue`, so the demo `.vue` files loaded by the
 * generated stories need the root tsconfig `paths` as aliases. Without them, the dependency scan
 * fails, and vite re-bundles and reloads the tests while they run.
 */
function rootTsconfigPathAliases() {
    const rootDir = path.resolve(path.dirname(importUrl.pathname), '../../..');
    const { compilerOptions } = JSON.parse(fs.readFileSync(path.join(rootDir, 'tsconfig.json'), 'utf8'));
    const baseUrl = path.resolve(rootDir, compilerOptions.baseUrl);
    return Object.entries<string[]>(compilerOptions.paths).map(([key, [target]]) => ({
        find: new RegExp(`^${key.replace('*', '(.*)')}$`),
        replacement: path.join(baseUrl, target.replace('*', '$1')),
    }));
}

const config: StorybookConfig = {
    addons: ['@storybook/addon-a11y'],
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: ['../../site-demo/static/'],
    framework: {
        name: '@storybook/vue3-vite',
        options: { docgen: false },
    },
    core: {
        disableWhatsNewNotifications: true,
    },
    async viteFinal(config) {
        return mergeConfig(config, {
            resolve: { alias: rootTsconfigPathAliases() },
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
                        await generateVueDemoStories(this.info.bind(this));
                    },
                } satisfies Plugin,
            ],
        });
    },
};
export default config;
