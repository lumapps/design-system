const Generator = require('yeoman-generator');

const snakeCase = require('lodash/snakeCase');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('name', { description: 'The name of the component to create', type: String });

        this.option('functional', { description: 'Generate a Functional component', type: Boolean });
        this.option('class', { description: 'Generate a Class component', type: Boolean });

        this.option('pure', { description: 'Generate a pure component', type: Boolean });
        this.option('not-pure', { description: 'Generate a normal component', type: Boolean });

        this.option('with-validation', { description: 'Enable component validation helpers', type: Boolean });
        this.option('without-validation', { description: 'Skip the component validation', type: Boolean });

        this.option('pre-validate', { description: 'Pre-validate the component', type: Boolean });
        this.option('validate-children-number', { description: 'Validate the number of children', type: Boolean });
        this.option('validate-children-types', { description: 'Validate the types of the children', type: Boolean });
        this.option('transform-child', { description: 'Transform each child', type: Boolean });
        this.option('validate-child', { description: 'Validate each child', type: Boolean });
        this.option('post-validate', { description: 'Post-validate the component', type: Boolean });

        this.option('validations-given', { hide: true, type: Boolean });
    }

    prompting() {
        const prompts = [
            {
                message: 'What is the component name?',
                name: 'name',
                type: 'input',
                validate: (inputtedName) => /^[A-Z][a-z]+[A-Z]?[a-z]*$/.test(inputtedName),
                when: this.options.name === undefined || this.options.name.length === 0,
            },
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
                message: 'What sorts of validation do you want to have?',
                name: 'validations',
                type: 'checkbox',
                when: (answers) =>
                    (this.options['with-validation'] || answers.validation) &&
                    !this.options['without-validation'] &&
                    this.options['validation-given'] === undefined,
            },
        ];

        return this.prompt(prompts).then((answers) => {
            this.answers = answers;
        });
    }

    writing() {
        const path = `src/components/${snakeCase(this.options.name || this.answers.name)}/react`;

        const isValidationEnabled =
            (this.options['with-validation'] || this.answers.validation) && !this.options['without-validation'];
        const validations = [];
        if (isValidationEnabled) {
            if (this.options['pre-validate']) {
                validations.push('pre');
            }
            if (this.options['validate-children-number']) {
                validations.push('number');
            }
            if (this.options['validate-children-types']) {
                validations.push('types');
            }
            if (this.options['transform-child']) {
                validations.push('transform');
            }
            if (this.options['validate-child']) {
                validations.push('child');
            }
            if (this.options['post-validate']) {
                validations.push('post');
            }
        }

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
