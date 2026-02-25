import { createStorybookVitestConfig } from '@lumx/storybook-testing/vitest-config.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import viteConfig from '../vite.config.mts';

export default createStorybookVitestConfig({
    name: '@lumx/react storybook',
    configDir: path.dirname(fileURLToPath(import.meta.url)),
    viteConfig,
});
