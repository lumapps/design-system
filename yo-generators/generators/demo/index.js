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
        const path = 'demo/react/doc/product/components';

        this.fs.copyTpl(
            this.templatePath('demo.mdx.ejs'),
            this.destinationPath(`${path}/${kebabCase(this.options.name || this.answers.name)}.mdx`),
            {
                componentName: this.options.name || this.answers.name,
            },
        );
    }
};
