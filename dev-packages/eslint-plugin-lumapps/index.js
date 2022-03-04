/* eslint-disable no-var */
module.exports = {
    rules: {
        'do-not-import-all-lodash': {
            docs: {
                description: 'Do not import all lodash',
                category: 'Best Practices',
                recommended: true,
            },
            create(context) {
                return {
                    ImportDeclaration(node) {
                        var sourceCode = context.getSourceCode();
                        var regexp = /.* 'lodash';/gm;
                        var line = sourceCode.getText(node);

                        if (regexp.exec(line) !== null) {
                            context.report(
                                node,
                                'Do not import all the function from lodash, since this has a heavy impact on performance. Please import each function using import <function> from lodash/<function>',
                            );
                        }
                    },
                };
            },
        },
    },
};
