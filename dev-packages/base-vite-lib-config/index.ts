import path from 'path';
import { defineConfig } from 'vite';
import { dts } from 'rolldown-plugin-dts';
import fixEsmImports from '@lumx/vite-plugin-fix-esm-imports';
import optimizeImportsLumxIcons from '@lumx/vite-plugin-optimize-icons-imports';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export function toPackageRegex(pkgName: string) {
    return new RegExp(`^${pkgName}(/.*)?`);
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
                external,
                output: {
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: formatPath,
                    chunkFileNames: formatPath,
                },
            },
        },
        plugins: [
            /** Generate per-file `.d.ts` declarations. */
            dts(),
            /** Fix ESM imports to add .js extensions for lodash sub-module imports. */
            fixEsmImports(),
            /** Transform @lumx/icons imports to direct ESM imports. */
            optimizeImportsLumxIcons(),
            /** Copy additional files to dist. */
            viteStaticCopy({
                targets: [
                    // dest:'dist' compensates for vite-plugin-static-copy prepending a '..' to dest when src is outside config.root.
                    { src: '../../LICENSE.md', dest: 'dist' },
                    { src: 'README.md', dest: '' },
                    { src: 'package.json', dest: '' },
                ],
            }),
        ],
    });
};
