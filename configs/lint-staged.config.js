/* eslint-disable import/no-commonjs, import/unambiguous */

module.exports = {
    concurrent: true,
    ignore: ['**/dist/*', '**/build/*', '**/node_modules/*'],
    linters: {
        '*.{js,jsx}': ['prettier-eslint --prettier-last --write', 'git add', 'eslint'],
        '*.{ts,tsx}': ['prettier-tslint fix', 'git add', 'tslint'],
        '*.css': ['prettier-stylelint --prettier-last --write', 'git add', 'stylelint'],
        '*.scss': ['prettier-stylelint --prettier-last --write', 'git add', 'stylelint --syntax=scss'],
        '*.{md,html}': ['prettier --write', 'git add'],
    },
};
