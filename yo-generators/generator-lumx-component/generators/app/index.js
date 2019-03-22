const Generator = require('yeoman-generator');

const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('name', { description: 'The name of the component to create', type: String });

        this.option('with-tests', { description: 'Generate the associated tests file', type: Boolean });
        this.option('without-tests', { description: 'Do not generate the associated tests file', type: Boolean });

        this.option('with-validation', { description: 'Enable component validation helpers', type: Boolean });
        this.option('without-validation', { description: 'Skip the component validation', type: Boolean });

        this.option('pre-validate', { description: 'Pre-validate the component', type: Boolean });
        this.option('validate-children-number', { description: 'Validate the number of children', type: Boolean });
        this.option('validate-children-types', { description: 'Validate the types of the children', type: Boolean });
        this.option('transform-child', { description: 'Transform each child', type: Boolean });
        this.option('validate-child', { description: 'Validate each child', type: Boolean });
        this.option('post-validate', { description: 'Post-validate the component', type: Boolean });
    }

    prompting() {
        this.log(yosay(`Welcome to the ${chalk.red('LumX React component')} generator!`));

        const prompts = [
            {
                message: 'What is the component name?',
                name: 'name',
                type: 'input',
                validate: (inputtedName) => /^[A-Z][a-z]+[A-Z]?[a-z]*$/.test(inputtedName),
                when: this.options.name === undefined || this.options.name.length === 0,
            },
            {
                default: true,
                message: 'Do you want to create the associated tests file?',
                name: 'test',
                type: 'confirm',
                when: this.options['with-tests'] === undefined && this.options['without-tests'] === undefined,
            },
            {
                default: false,
                message: 'Do you want to have any children or props validation?',
                name: 'validation',
                type: 'confirm',
                when: this.options['with-validation'] === undefined && this.options['without-validation'] === undefined,
            },
            {
                choices: [
                    { name: 'Pre-validation', value: 'pre', checked: true },
                    { name: 'Number of children', value: 'number', checked: true },
                    { name: 'Children types', value: 'types', checked: true },
                    { name: 'Child transformation', value: 'transform', checked: false },
                    { name: 'Child validation', value: 'child', checked: true },
                    { name: 'Post-validation', value: 'post', checked: false },
                ],
                default: ['pre', 'number', 'types', 'child'],
                message: 'What sorts of validation do you want to have toto?',
                name: 'validations',
                type: 'checkbox',
                when: (answers) =>
                    (this.options['with-validation'] || answers.validation) && !this.options['without-validation'],
            },
        ];

        return this.prompt(prompts).then((answers) => {
            this.answers = answers;
        });
    }

    composing() {
        const isValidationEnabled =
            (this.options['with-validation'] || this.answers.validation) && !this.options['without-validation'];

        const answeredValidations = this.answers.validations || [];
        const validations = {
            'pre-validate': this.options['pre-validate'] || answeredValidations.indexOf('pre') > -1,
            'validate-children-number':
                this.options['validate-children-number'] || answeredValidations.indexOf('number') > -1,
            'validate-children-types':
                this.options['validate-children-types'] || answeredValidations.indexOf('types') > -1,
            'transform-child': this.options['transform-child'] || answeredValidations.indexOf('transform') > -1,
            'validate-child': this.options['validate-child'] || answeredValidations.indexOf('child') > -1,
            'post-validate': this.options['post-validate'] || answeredValidations.indexOf('post') > -1,
        };

        this.composeWith(require.resolve('../component'), {
            ...this.options,
            name: this.options.name || this.answers.name,

            'validation-given': isValidationEnabled,
            'with-validation': isValidationEnabled,

            ...validations,
        });

        if ((this.options['with-tests'] || this.answers.tests) && !this.options['without-tests']) {
            this.composeWith(require.resolve('../tests'), {
                ...this.options,
                name: this.options.name || this.answers.name,

                'validation-given': isValidationEnabled,
                'with-validation': isValidationEnabled,

                ...validations,
            });
        }
    }
};
