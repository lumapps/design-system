const path = require('path');
const { createProject } = require('./docgen.js');
const { parseReactComponent } = require('./react-docgen.js');
const { parseVueComponent } = require('./vue-docgen.js');

const ROOT_PATH = path.resolve(__dirname, '../../../..');

const PACKAGE_PATH_RX = /(packages\/lumx-[^/]+)/;

const PROJECTS = {
    'packages/lumx-react': { project: null, parse: parseReactComponent },
    'packages/lumx-vue': { project: null, parse: parseVueComponent },
};


/**
 * LumX docs prop table webpack loader
 *
 * @example import lumx react component prop table
 *    import ReactIcon from 'lumx-docs:@lumx/react/components/icon/Icon';
 * @example import lumx vue component prop table
 *    import VueIcon from 'lumx-docs:@lumx/vue/components/icon/Icon';
 */
function lumxDocsWebpackLoader() {
    this.cacheable?.();
    const callback = this.async();
    const filePath = this.resourcePath;

    try {
        const [_, packagePath] = filePath.match(PACKAGE_PATH_RX) || [];
        if (!packagePath) {
            throw new Error('Could not determine package from file path: ' + filePath);
        }

        const projectConf = PROJECTS[packagePath];
        if (!projectConf.project) {
            projectConf.project = createProject(path.resolve(ROOT_PATH, packagePath));
        }

        // Add dependency so webpack watches the component file
        this.addDependency(filePath);

        // Parse with the appropriate framework docgen
        const result = projectConf.parse(projectConf.project, filePath);

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
