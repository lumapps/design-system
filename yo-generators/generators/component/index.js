const kebabCase = require('lodash/kebabCase');

const MainGenerator = require('../');

/////////////////////////////

module.exports = class extends MainGenerator {
    constructor(args, opts) {
        super(args, opts);

        this.option('say-hi', { hide: true, type: Boolean });
    }

    prompting() {
        return super.prompting(Boolean(this.options['say-hi']));
    }

    writing() {
        const path = `src/components/${kebabCase(this.options.name || this.answers.name)}/react`;

        this.fs.copyTpl(
            this.templatePath('FunctionalComponent.tsx.ejs'),
            this.destinationPath(`${path}/${this.options.name || this.answers.name}.tsx`),
            {
                componentName: this.options.name || this.answers.name,
            },
        );
    }
};
