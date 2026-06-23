/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { createRequire } from 'module';
import * as sass from 'sass';
import fs from 'fs/promises';
import postcss from 'postcss';

import { mergeConfig, type Plugin } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import baseLibConfig, { toPackageRegex } from '@lumx/base-vite-lib-config';

import pkg from './package.json' with { type: 'json' };

// Require CJS postcss.config file
const postcssConfig = createRequire(import.meta.url)('../../configs/postcss.config.js');

/**
 * Custom SASS to CSS builder plugin to handle `sass-mq` and a custom SCSS entry point not imported via JS/TS.
 */
function sassBuilder(): Plugin {
    return {
        name: 'sass-builder',
        async closeBundle() {
            const inputs = ['src/scss/lumx.scss', 'src/scss/components-and-utils.scss'];
            const distPath = path.resolve(import.meta.dirname, 'dist');

            for (const scssInput of inputs) {
                const { css } = await sass.compileAsync(scssInput, {
                    style: 'expanded',
                    importers: [
                        {
                            findFileUrl: (url) => new URL(import.meta.resolve(url)),
                        },
                    ],
                });

                const { name } = path.parse(scssInput);
                const outputPath = path.resolve(distPath, `${name}.css`);

                await fs.mkdir(path.dirname(outputPath), { recursive: true });

                const { css: postProcess } = await postcss(postcssConfig.plugins).process(css, {
                    from: undefined,
                });
                await fs.writeFile(outputPath, postProcess);
                // eslint-disable-next-line no-console
                console.log(`${scssInput} → dist`);
            }
        },
    };
}

/** externalize all dependencies */
const external = Object.keys(pkg.dependencies).map(toPackageRegex);

/**
 * Vite config
 *
 * (shared with Vitest)
 */
export default mergeConfig(baseLibConfig({ pkg, external }), {
    plugins: [
        /** Copy additional files to dist. */
        viteStaticCopy({
            targets: [
                { src: 'src/{scss,css}', dest: '' },
            ],
        }),
        /** Compile standalone SCSS entry points to CSS. */
        sassBuilder(),
    ],
});
