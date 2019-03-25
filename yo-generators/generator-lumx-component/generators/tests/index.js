const snakeCase = require('lodash/snakeCase');

const MainGenerator = require('../app');

/////////////////////////////

module.exports = class extends MainGenerator {
    constructor(args, opts) {
        super(args, opts);

        this.option('validations-given', { hide: true, type: Boolean });
        this.option('say-hi', { hide: true, type: Boolean });
    }

    prompting() {
        return super.prompting(Boolean(this.options['say-hi']));
    }

    writing() {
        const path = `src/components/${snakeCase(this.options.name || this.answers.name)}/react`;

        const { isValidationEnabled, validations } = this._getValidations();

        this.fs.copyTpl(
            this.templatePath('Component.test.tsx.ejs'),
            this.destinationPath(`${path}/${this.options.name || this.answers.name}.test.tsx`),
            {
                componentName: this.options.name || this.answers.name,

                validateComponent: isValidationEnabled,
                preValidate: isValidationEnabled && validations.indexOf('pre') > -1,
                checkChildrenNumber: isValidationEnabled && validations.indexOf('number') > -1,
                checkChildrenTypes: isValidationEnabled && validations.indexOf('types') > -1,
                transformChild: isValidationEnabled && validations.indexOf('transform') > -1,
                validateChild: isValidationEnabled && validations.indexOf('child') > -1,
                postValidate: isValidationEnabled && validations.indexOf('post') > -1,
            },
        );
    }
};
