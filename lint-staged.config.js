/* eslint-disable import/no-commonjs, import/unambiguous */

module.exports = {
    concurrent: true,
    ignore: ['**/dist/*', '**/build/*', '**/node_modules/*'],
    linters: {
        'packages/*/src/**.{ts,tsx,js,jsx}': ['eslint'],
        '*.css': ['prettier-stylelint --prettier-last --write', 'git add', 'stylelint'],
        '*.scss': ['prettier-stylelint --prettier-last --write', 'git add', 'stylelint --syntax=scss'],
        '*.{md,html}': ['prettier --write', 'git add'],
    },
};
