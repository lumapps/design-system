const ModuleDependencyWarning = require('webpack/lib/ModuleDependencyWarning');

module.exports = {
    /**
     * Webpack plugin ignoring typescript type export warnings.
     */
    apply(compiler) {
        const messageRegExp = /components\//;

        const doneHook = (stats) => {
            // eslint-disable-next-line no-param-reassign
            stats.compilation.warnings = stats.compilation.warnings.filter(
                (warn) => !(warn instanceof ModuleDependencyWarning && messageRegExp.test(warn.message)),
            );
        };

        if (compiler.hooks) {
            compiler.hooks.done.tap('IgnoreNotFoundExportPlugin', doneHook);
        } else {
            compiler.plugin('done', doneHook);
        }
    },
};
