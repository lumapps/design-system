import { mergeConfig } from 'vite';

import baseLibConfig, { lumxExternal, toPackageRegex } from '@lumx/base-vite-lib-config';

import pkg from './package.json' with { type: 'json' };

/** externalize */
const external = [
    ...lumxExternal,
    // peer dependencies
    ...Object.keys(pkg.peerDependencies || {}).map(toPackageRegex),
];

/**
 * Vite config
 *
 * (shared with Vitest and Storybook)
 */
export default mergeConfig(baseLibConfig({ pkg, external }), {
    oxc: {
        jsx: { runtime: 'automatic', importSource: 'react' },
        include: /\.[jt]sx?$/,
    },
});
