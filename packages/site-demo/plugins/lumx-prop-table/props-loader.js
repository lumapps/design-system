const path = require('path');
const { createProject } = require('./docgen.js');
const { parseReactComponent } = require('./react-docgen.js');

const ROOT_PATH = path.resolve(__dirname, '../../../..');
const LUMX_REACT_PATH = path.resolve(ROOT_PATH, 'packages/lumx-react');

// Cache project instances at module level
let reactProject = null;

/**
 * LumX docs prop table webpack loader
 *
 * @example import lumx react component prop table
 *    import ReactIcon from 'lumx-docs:@lumx/react/components/icon/Icon';
 */
function lumxDocsWebpackLoader() {
    this.cacheable?.();
    const callback = this.async();
    const filePath = this.resourcePath;

    try {
        if (!reactProject) {
            reactProject = createProject(LUMX_REACT_PATH);
        }

        // Add dependency so webpack watches the component file
        this.addDependency(filePath);

        // Parse
        const result = parseReactComponent(reactProject, filePath);

        if (!result) {
            throw new Error('Could not load prop docs for component ' + filePath);
        }

        const code = `const docs = ${JSON.stringify(result)}; export default docs;`;
        callback(null, code);
    } catch (err) {
        callback(err);
    }
}

module.exports = lumxDocsWebpackLoader;
