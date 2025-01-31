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
        const path = `packages/lumx-react/src/components/${kebabCase(componentName)}`;
        const className = `lumx-${kebabCase(componentName)}`;

        this.fs.copyTpl(
            this.templatePath('FunctionalComponent.tsx.ejs'),
            this.destinationPath(`${path}/${componentName}.tsx`),
            { componentName, className },
        );
    }
};
