import type { SandpackProviderProps } from '@codesandbox/sandpack-react';
import type { FlexBoxProps } from '@lumx/react';

import type { Demo } from '../types';

const BASE_STYLES = `
.demo-block {
    padding: 24px;
}
code {
    padding: 0 4px;
    font-family: monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--lumx-color-dark-N);
    background-color: var(--lumx-color-dark-L5);
}
`;

/** Theme trying to match the prismjs github theme */
export const github = {
    syntax: {
        keyword: '#00009f',
        property: '#00a4db',
        plain: '#000000',
        static: '#032f62',
        string: '#e3116c',
        definition: '#00009f',
        punctuation: '#24292e',
        tag: '#00009f',
    },
    font: {
        mono: 'monospace',
        size: '14px',
        lineHeight: '1.5',
    },
};

/** Convert `@lumx/demo` local imports to node_modules files for Sandpack resolution. */
function localImportsToNodeModules(localImports: Record<string, string>, defaultExtension: string) {
    const entries = Object.entries(localImports);
    if (entries.length === 0) return {};
    return {
        '/node_modules/@lumx/demo/package.json': {
            hidden: true,
            code: JSON.stringify({ name: '@lumx/demo', version: '0.0.0' }),
        },
        ...Object.fromEntries(
            entries.map(([key, code]) => [
                `/node_modules/${key}${/\.\w+$/.test(key) ? '' : defaultExtension}`,
                { hidden: true, code },
            ]),
        ),
    };
}

/**
 * Setup React Sandpack configuration.
 */
export function setupReactSandpack(
    demo: Demo,
    flexBoxProps: FlexBoxProps = {},
    frontVersion: string,
): SandpackProviderProps {
    const serializedProps = Object.entries(flexBoxProps)
        .map(([key, value]) => {
            if (value === undefined || value == null) return '';
            return `${key}={${JSON.stringify(value)}}`;
        })
        .join(' ');

    return {
        template: 'react-ts',
        files: {
            'tsconfig.json': {
                hidden: true,
                code: JSON.stringify(
                    {
                        compilerOptions: {
                            jsx: 'react-jsx',
                            lib: ['dom', 'es2021'],
                        },
                        includes: ['**/*'],
                    },
                    null,
                    2,
                ),
            },
            'styles.css': {
                hidden: true,
                code: BASE_STYLES,
            },
            'index.tsx': {
                hidden: true,
                code: `
import { createRoot } from "react-dom/client";
import { FlexBox } from "@lumx/react";
import "@lumx/core/lumx.css";
import "./styles.css";
import "focus-visible";
import App from "./App";
createRoot(document.getElementById("root"))
    .render(<FlexBox className="demo-block" ${serializedProps}><App /></FlexBox>);
`.trim(),
            },
            ...localImportsToNodeModules(demo.localImports, '.tsx'),
            'App.tsx': {
                active: true,
                code: demo.sourceCode,
            },
        },
        customSetup: {
            dependencies: {
                '@lumx/react': frontVersion,
                '@lumx/icons': frontVersion,
                '@lumx/core': frontVersion,
                'focus-visible': '^5.0.2',
            },
        },
        theme: github,
    };
}

const CORRECTED_VUE_FLEXBOX_PROPS: Record<string, string> = {
    vAlign: 'verticalAlign',
    hAlign: 'horizontalAlign',
};

/**
 * Setup Vue Sandpack configuration.
 */
export function setupVueSandpack(
    demo: Demo,
    flexBoxProps: FlexBoxProps = {},
    frontVersion: string,
): SandpackProviderProps {
    const serializedProps = Object.entries(flexBoxProps)
        .map(([key, value]) => {
            if (value === undefined || value == null) return '';
            const correctedKey = CORRECTED_VUE_FLEXBOX_PROPS[key] || key;
            return `:${correctedKey}="${JSON.stringify(value).replace(/"/g, "'")}"`;
        })
        .join(' ');

    return {
        template: 'vue-ts',
        files: {
            'tsconfig.json': {
                hidden: true,
                code: JSON.stringify(
                    {
                        compilerOptions: {
                            jsx: 'preserve',
                            esModuleInterop: true,
                            lib: ['dom', 'es2021'],
                        },
                        includes: ['**/*'],
                    },
                    null,
                    2,
                ),
            },
            ...localImportsToNodeModules(demo.localImports, '.vue'),
            '/src/styles.css': {
                hidden: true,
                code: BASE_STYLES,
            },
            '/src/App.vue': {
                hidden: true,
                code: `
<script setup>
import { FlexBox } from "@lumx/vue";
import "@lumx/core/lumx.css";
import "focus-visible";
import Demo from "./Demo.vue";
</script>
<template>
    <FlexBox class="demo-block" ${serializedProps}><Demo /></FlexBox>
</template>
`.trim(),
            },
            '/src/Demo.vue': {
                active: true,
                code: demo.sourceCode,
            },
        },
        customSetup: {
            dependencies: {
                '@lumx/vue': frontVersion,
                '@lumx/icons': frontVersion,
                '@lumx/core': frontVersion,
                'focus-visible': '^5.0.2',
            },
        },
        theme: github,
    };
}

export const SETUP = {
    react: setupReactSandpack,
    vue: setupVueSandpack,
};
