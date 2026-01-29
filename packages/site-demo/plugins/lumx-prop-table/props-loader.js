const path = require('path');
const { createProject, parseComponent } = require('./docgen.js');

const ROOT_PATH = path.resolve(__dirname, '../../../..');
const LUMX_REACT_PATH = path.resolve(ROOT_PATH, 'packages/lumx-react');

// Cache project instance at module level
let project = null;

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
        if (!project) {
            project = createProject(LUMX_REACT_PATH);
        }

        // Add dependency so webpack watches the component file
        this.addDependency(filePath);

        // Parse
        const result = parseComponent(project, filePath);

        if (!result) {
            throw new Error('Could not load prop docs for component ' + filePath);
        }

        const code = `module.exports = ${JSON.stringify(result)};`;
        callback(null, code);
    } catch (err) {
        callback(err);
    }
}

module.exports = lumxDocsWebpackLoader;
