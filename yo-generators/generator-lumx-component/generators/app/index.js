const Generator = require('yeoman-generator');

const chalk = require('chalk');
const yosay = require('yosay');

/////////////////////////////

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        if (opts.namespace === 'lumx-component:app') {
            this.isMainGenerator = true;

            this.option('with-tests', { description: 'Generate the associated tests file', type: Boolean });
            this.option('without-tests', { description: 'Do not generate the associated tests file', type: Boolean });

            this.option('with-demo', { description: 'Generate the associated demo file', type: Boolean });
            this.option('without-demo', { description: 'Do not generate the associated demo file', type: Boolean });
        }

        this.option('name', { description: 'The name of the component to create', type: String });

        this.option('with-validation', { description: 'Enable component validation helpers', type: Boolean });
        this.option('without-validation', { description: 'Skip the component validation', type: Boolean });

        this.option('pre-validate', { description: 'Pre-validate the component', type: Boolean });
        this.option('validate-children-number', { description: 'Validate the number of children', type: Boolean });
        this.option('validate-children-types', { description: 'Validate the types of the children', type: Boolean });
        this.option('transform-child', { description: 'Transform each child', type: Boolean });
        this.option('validate-child', { description: 'Validate each child', type: Boolean });
        this.option('post-validate', { description: 'Post-validate the component', type: Boolean });

        /////////////////////////////

        this.prompts = [
            {
                message: 'What is the component name (in PascalCase)?',
                name: 'name',
                type: 'input',
                validate: (inputtedName) => {
                    if (!/^[A-Z][a-z]*([A-Z]?[a-z]*)/.test(inputtedName)) {
                        return 'Your component name should be writter in PascalCase (i.e. starting with an uppercase letter)';
                    }

                    return true;
                },
                when: this.options.name === undefined || this.options.name.length === 0,
            },
            {
                default: false,
                message: 'Do you want to have any children or props validation?',
                name: 'validation',
                type: 'confirm',
                when:
                    this.options['with-validation'] === undefined &&
                    this.options['without-validation'] === undefined &&
                    !this.options['validations-given'],
            },
            {
                choices: [
                    { name: 'Pre-validation', value: 'pre', checked: false },
                    { name: 'Number of children', value: 'number', checked: false },
                    { name: 'Children types', value: 'types', checked: false },
                    { name: 'Child transformation', value: 'transform', checked: false },
                    { name: 'Child validation', value: 'child', checked: false },
                    { name: 'Post-validation', value: 'post', checked: false },
                ],
                default: [],
                message: 'What sorts of validation do you want to have ?',
                name: 'validations',
                type: 'checkbox',
                when: (answers) =>
                    (this.options['with-validation'] || answers.validation) &&
                    !this.options['without-validation'] &&
                    !this.options['validations-given'],
            },
        ];

        if (opts.namespace === 'lumx-component:app') {
            this.prompts.push({
                default: true,
                message: 'Do you want to create the associated tests file?',
                name: 'test',
                type: 'confirm',
                when: this.options['with-tests'] === undefined && this.options['without-tests'] === undefined,
            });

            this.prompts.push({
                default: true,
                message: 'Do you want to create the associated demo file?',
                name: 'demo',
                type: 'confirm',
                when: this.options['with-demo'] === undefined && this.options['without-demo'] === undefined,
            });
        }
    }

    prompting(sayHi = true) {
        if (sayHi) {
            this.log(yosay(`Welcome to the ${chalk.red('LumX React component')} generator!`));
        }

        return this.prompt(this.prompts).then((answers) => {
            this.answers = answers;
        });
    }

    _getValidations() {
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

        return { isValidationEnabled, validations };
    }

    _getValidationsOptions() {
        const { isValidationEnabled, validations } = this._getValidations();

        return {
            validateComponent: isValidationEnabled,
            preValidate: isValidationEnabled && validations['pre-validate'],
            checkChildrenNumber: isValidationEnabled && validations['validate-children-number'],
            checkChildrenTypes: isValidationEnabled && validations['validate-children-types'],
            transformChild: isValidationEnabled && validations['transform-child'],
            validateChild: isValidationEnabled && validations['validate-child'],
            postValidate: isValidationEnabled && validations['post-validate'],
        };
    }

    composing() {
        const { isValidationEnabled, validations } = this._getValidations();

        this.composeWith(require.resolve('../component'), {
            ...this.options,
            name: this.options.name || this.answers.name,

            'validations-given': isValidationEnabled,
            'with-validation': isValidationEnabled,
            'say-hi': false,

            ...validations,
        });

        if ((this.options['with-tests'] || this.answers.tests) && !this.options['without-tests']) {
            this.composeWith(require.resolve('../tests'), {
                ...this.options,
                name: this.options.name || this.answers.name,

                'validations-given': isValidationEnabled,
                'with-validation': isValidationEnabled,
                'say-hi': false,

                ...validations,
            });
        }

        if ((this.options['with-demo'] || this.answers.demo) && !this.options['without-demo']) {
            this.composeWith(require.resolve('../demo'), {
                ...this.options,
                name: this.options.name || this.answers.name,
                'say-hi': false,
            });
        }
    }
};
