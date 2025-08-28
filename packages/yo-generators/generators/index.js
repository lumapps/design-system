const Generator = require('yeoman-generator');

const chalk = require('chalk');

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
            this.log(`Welcome to the ${chalk.red('LumX React component')} generator!`);
        }

        return this.prompt(this.prompts).then((answers) => {
            this.answers = answers;
        });
    }

    composing() {
        this.composeWith(require.resolve('./component'), {
            ...this.options,
            name: this.options.name || this.answers.name,

            'say-hi': false,
        });

        if ((this.options['with-tests'] || this.answers.tests) && !this.options['without-tests']) {
            this.composeWith(require.resolve('./tests'), {
                ...this.options,
                name: this.options.name || this.answers.name,

                'say-hi': false,
            });
        }

        if ((this.options['with-demo'] || this.answers.demo) && !this.options['without-demo']) {
            this.composeWith(require.resolve('./demo'), {
                ...this.options,
                name: this.options.name || this.answers.name,
                'say-hi': false,
            });
        }
    }
};
