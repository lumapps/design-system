const fs = require('fs');
const path = require('path');
const memoize = require('lodash/memoize');
const { ROOT_PATH } = require('../../../../configs/path');
const { getParameters } = require('codesandbox-import-utils/lib/api/define');

const REACT_VERSION = '18.2.0';

/** Base config for the LumX CodeSandbox */
const BASE_SANDBOX_CONFIG = {
    // Bootstrap app with LumX core and ReactDOM.createRoot
    'index.tsx': {
        content: `import "@lumx/core/lumx.css";
import ReactDOM from "react-dom/client";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);`,
    },
    'package.json': {
        content: JSON.stringify({
            main: 'index.tsx',
            dependencies: {
                '@lumx/core': 'latest',
                '@lumx/icons': 'latest',
                '@lumx/react': 'latest',
                react: REACT_VERSION,
                'react-dom': REACT_VERSION,
            },
            devDependencies: {
                '@types/react': REACT_VERSION,
                '@types/react-dom': REACT_VERSION,
                typescript: '4.4.2',
            },
        }),
    },
};

// Extra demo components we do not ship in @lumx
const DEMO_COMPONENTS = {
    '@lumx/demo/components/content/Placeholder': {
        source: 'packages/site-demo/src/components/content/Placeholder/index.tsx',
        fileName: 'Placeholder.tsx',
    },
};

/** Prepare files to load in the sandbox based on the demo code */
function prepareFiles(pageImports, demoCode) {
    const config = { ...BASE_SANDBOX_CONFIG };
    let content = demoCode;

    // JSX without imports or components
    if (content.trim().startsWith('<')) {
        // Wrap JSX code into a component
        const component = `export const App = () => (
    <>
        ${content.replaceAll('\n', '\n        ')}
    </>
);`;

        // Add page imports and then the component
        content = `${pageImports}\n\n${component}`;
    }

    // Replace path to demo components
    for (let [originalPath, { source, fileName }] of Object.entries(DEMO_COMPONENTS)) {
        if (content.includes(originalPath)) {
            // Replace path (without extension)
            content = content.replaceAll(originalPath, `./${fileName.replace('\..+$')}`);
            // Put demo component file in the sandbox
            const demoFileContent = fs.readFileSync(path.resolve(ROOT_PATH, source)).toString();
            config[fileName] = { content: demoFileContent };
        }
    }

    // Add demo code in the sandbox
    config['App.tsx'] = { content };

    return config;
}

/** List import code lines from the MDX page */
const getPageImports = memoize((mdxString) => {
    // Make sure to always have React
    const lines = new Set(["import React from 'react';"]);
    for (const line of mdxString.trim().split('\n')) {
        let lineTrimmed = line.trim();
        if (!lineTrimmed || !lineTrimmed.startsWith('import')) break;
        lines.add(lineTrimmed);
    }
    return Array.from(lines.values()).join('\n');
});

/**
 * Try to generate a CodeSandbox URL for the given demo code
 */
module.exports = function generateCodesandboxURL(mdxString, demoCode) {
    // Get JS import from the page
    const pageImports = getPageImports(mdxString);
    // Generate sandbox files
    const files = prepareFiles(pageImports, demoCode);
    // Generate CodeSandbox URL parameters
    const parameters = getParameters({ files });
    return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;
};
