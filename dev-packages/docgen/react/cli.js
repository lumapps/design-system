const path = require('path');
const { createProject, findNearestTsConfigDir } = require('../project.js');
const { parseReactComponent } = require('./docgen.js');

/**
 * CLI entrypoint - run docgen for a single React component
 * Usage: node cli.js <component-path>
 * Example: node cli.js packages/lumx-react/src/components/button/Button.tsx
 */
const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Usage: node cli.js <component-path>');
    console.error('Example: node cli.js packages/lumx-react/src/components/button/Button.tsx');
    process.exit(1);
}

const componentPath = path.resolve(args[0]);
const projectDir = findNearestTsConfigDir(componentPath);

if (!projectDir) {
    console.error('Error: Could not find a tsconfig.json for ' + componentPath);
    process.exit(1);
}

try {
    const project = createProject(projectDir);
    const result = parseReactComponent(project, componentPath);

    if (!result) {
        console.error('Error: Could not extract props from component');
        process.exit(1);
    }

    console.log(JSON.stringify(result, null, 2));
} catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
}
