const kebabCase = require('lodash/kebabCase');

const MainGenerator = require('../');

module.exports = class extends MainGenerator {
    constructor(args, opts) {
        super(args, opts);

        this.option('say-hi', { hide: true, type: Boolean });
    }

    prompting() {
        return super.prompting(Boolean(this.options['say-hi']));
    }

    writing() {
        const componentName = this.options.name || this.answers.name;
        const kbComponentName = kebabCase(componentName);

        const path = `packages/site-demo/content/product/components/${kbComponentName}`;

        this.fs.copyTpl(
            this.templatePath('index.mdx.ejs'),
            this.destinationPath(`${path}/index.mdx`),
            { componentName, kbComponentName },
        );
        this.fs.copyTpl(
            this.templatePath('react/default.tsx.ejs'),
            this.destinationPath(`${path}/react/default.tsx`),
            { componentName, kbComponentName },
        );
        this.fs.copyTpl(
            this.templatePath('angularjs/controller.js.ejs'),
            this.destinationPath(`${path}/angularjs/controller.js`),
            { componentName, kbComponentName },
        );
        this.fs.copyTpl(
            this.templatePath('angularjs/default.html.ejs'),
            this.destinationPath(`${path}/angularjs/default.html`),
            { componentName, kbComponentName },
        );

        console.warn(`\nWarning: Add the following line to the 'lumx-react/src/index.js' file for the demo to work:

            export { ${componentName}, ${componentName}Props } from './components/${kbComponentName}/${componentName}';
        `)
    }
};
