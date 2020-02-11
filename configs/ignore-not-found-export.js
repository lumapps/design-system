module.exports = {
    /**
     * Webpack plugin ignoring typescript type export warnings.
     */
    apply(compiler) {
        const regExp = /^ModuleDependencyWarning:.*components\//;

        const doneHook = (stats) => {
            // eslint-disable-next-line no-param-reassign
            stats.compilation.warnings = stats.compilation.warnings.filter((warn) => !regExp.test(warn.toString()));
        };

        if (compiler.hooks) {
            compiler.hooks.done.tap('IgnoreNotFoundExportPlugin', doneHook);
        } else {
            compiler.plugin('done', doneHook);
        }
    },
};
