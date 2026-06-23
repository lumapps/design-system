import path from 'path';

import { mergeConfig } from 'vite';

import baseLibConfig, { toPackageRegex } from '@lumx/base-vite-lib-config';

import pkg from './package.json' with { type: 'json' };
import lumxCorePkg from '../lumx-core/package.json' with { type: 'json' };

/** externalize */
const external = [
    // @lumx/core exports — externalize exact re-export paths
    ...Object.keys(lumxCorePkg.exports).map((subpath) => path.join('@lumx/core', subpath)),
    // @lumx/icons
    /^@lumx\/icons(\/.*)?/,
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
