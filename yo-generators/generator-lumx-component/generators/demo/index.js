const snakeCase = require('lodash/snakeCase');

const MainGenerator = require('../app');

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
        const path = `demo/react/components/${snakeCase(this.options.name || this.answers.name)}`;

        this.fs.copyTpl(this.templatePath('index.tsx.ejs'), this.destinationPath(`${path}/index.tsx`), {
            componentName: this.options.name || this.answers.name,
        });
        this.fs.copyTpl(this.templatePath('default.tsx.ejs'), this.destinationPath(`${path}/default.tsx`), {
            componentName: this.options.name || this.answers.name,
        });
    }
};
