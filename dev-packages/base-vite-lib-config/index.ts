import path from 'path';
import { defineConfig, esmExternalRequirePlugin, type Plugin } from 'vite';
import { dts } from 'rolldown-plugin-dts';
import fixEsmImports from 'rollup-plugin-lumx-fix-esm-imports';
import optimizeImportsLumxIcons from 'rollup-plugin-optimize-imports-lumx-icons';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import lumxCorePkg from '../../packages/lumx-core/package.json' with { type: 'json' };

export function toPackageRegex(pkgName: string) {
    return new RegExp(`^${pkgName}(/.*)?$`);
}

/**
 * Externals for the libs built on top of @lumx/core:
 * - @lumx/core: only the paths in its package.json `exports` (other paths get bundled)
 * - @lumx/icons: all paths
 */
export const lumxExternal = [
    ...Object.keys(lumxCorePkg.exports).map((subpath) => path.join('@lumx/core', subpath)),
    toPackageRegex('@lumx/icons'),
];

/**
 * Apply plugins on `vite build` only (the lib config is shared with vitest and storybook).
 * Plugins made for the dev server only (`apply: 'serve'`) are dropped.
 */
export function buildOnly(...plugins: (Plugin | Plugin[])[]): Plugin[] {
    return plugins
        .flat()
        .filter((plugin) => plugin.apply !== 'serve')
        .map((plugin) => ({ ...plugin, apply: 'build' }));
}

interface Options {
    pkg: {
        exports: Record<string, string | { default: string }>;
    };
    external: (string | RegExp)[];
}

/**
 * Shared base vite config for lumx libs
 */
export default ({ pkg, external }: Options) => {
    // Bundle entry points from the package.json `exports` field.
    const input = Object.values(pkg.exports)
        .map((e) => (typeof e === 'object' ? e.default : undefined))
        .filter(Boolean)
        .map((importPath) => path.join('src', (importPath as string).replace(/index\..*$/, 'index')));

    // Move internal modules to hash named files.
    function formatPath(entry: { name: string }) {
        if (entry.name.includes('_internal') || !input.some((file) => `src/${entry.name}`.startsWith(file))) {
            return '_internal/[name].js';
        }
        return '[name].js';
    }

    return defineConfig({
        resolve: {
            /** Use tsconfig path aliases natively. */
            tsconfigPaths: true,
        },
        oxc: {
            exclude: [/\.js$/, /\.d\.[cm]?ts$/],
        },
        build: {
            outDir: 'dist',
            // Disable minification to keep readable, source-like output
            minify: false,
            lib: {
                entry: input,
                formats: ['es'],
            },
            rolldownOptions: {
                plugins: [
                    /** Generate per-file `.d.ts` declarations (build only: it fails in the vitest dev server). */
                    dts(),
                    /**
                     * Externalize dependencies, and convert their `require()` (in inlined CJS deps like
                     * `use-sync-external-store`) into ESM imports. Else rolldown emits a `__require()`
                     * that throws in browsers. Do not use `external`: it skips this plugin.
                     */
                    esmExternalRequirePlugin({ external }),
                ],
                output: {
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: formatPath,
                    chunkFileNames: formatPath,
                },
            },
        },
        plugins: [
            /** Transform @lumx/icons imports to direct ESM imports (also speeds up vitest and storybook). */
            optimizeImportsLumxIcons(),
            ...buildOnly(
                /** Fix ESM imports to add .js extensions for lodash sub-module imports. */
                fixEsmImports(),
                /** Copy additional files to dist. */
                viteStaticCopy({
                    targets: [
                        // dest:'dist' compensates for vite-plugin-static-copy prepending a '..' to dest when src is outside config.root.
                        { src: '../../LICENSE.md', dest: 'dist' },
                        { src: 'README.md', dest: '' },
                        { src: 'package.json', dest: '' },
                    ],
                }),
            ),
        ],
    });
};
