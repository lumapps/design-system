const snakeCase = require('lodash/snakeCase');

const MainGenerator = require('../app');

/////////////////////////////

module.exports = class extends MainGenerator {
    constructor(args, opts) {
        super(args, opts);

        this.option('functional', { description: 'Generate a Functional component', type: Boolean });
        this.option('class', { description: 'Generate a Class component', type: Boolean });

        this.option('pure', { description: 'Generate a pure component', type: Boolean });
        this.option('not-pure', { description: 'Generate a normal component', type: Boolean });

        this.option('validations-given', { hide: true, type: Boolean });
        this.option('say-hi', { hide: true, type: Boolean });

        /////////////////////////////

        this.prompts = this.prompts.concat([
            {
                choices: [
                    { name: 'Class component', value: 'class', short: 'Class' },
                    { name: 'Functional component', value: 'functional', short: 'Functional' },
                ],
                default: 0,
                message: 'Would you like to create a Class or a Functional component?',
                name: 'type',
                type: 'list',
                when: this.options.class === undefined && this.options.functional === undefined,
            },
            {
                default: false,
                message: 'Do you want your Class component to be a PureComponent?',
                name: 'pure',
                type: 'confirm',
                when: (answers) =>
                    (this.options.class || answers.type === 'class') &&
                    this.options.pure === undefined &&
                    this.options['not-pure'] === undefined,
            },
        ]);
    }

    prompting() {
        return super.prompting(Boolean(this.options['say-hi']));
    }

    writing() {
        const path = `src/components/${snakeCase(this.options.name || this.answers.name)}/react`;

        const { isValidationEnabled, validations } = this._getValidations();

        this.fs.copyTpl(
            this.templatePath(
                this.options.functional || this.answers.type === 'functional'
                    ? 'FunctionalComponent.tsx.ejs'
                    : 'ClassComponent.tsx.ejs',
            ),
            this.destinationPath(`${path}/${this.options.name || this.answers.name}.tsx`),
            {
                componentName: this.options.name || this.answers.name,
                componentType: (this.options.pure || this.answers.pure) && !this.options['not-pure'] ? 'Pure' : '',

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
