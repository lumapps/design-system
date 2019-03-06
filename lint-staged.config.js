/* eslint-disable import/no-commonjs, import/unambiguous */

module.exports = {
    concurrent: true,
    ignore: ['**/dist/*', '**/build/*'],
    linters: {
        '*.{js,jsx}': ['prettier-eslint --prettier-last --write', 'git add', 'eslint'],
        '*.{ts,tsx}': ['tslint --fix', 'prettier --write', 'git add', 'tslint'],
        '*.css': ['stylelint --fix', 'prettier --write', 'git add', 'stylelint'],
        '*.{scss}': ['stylelint --syntax=scss --fix', 'prettier --write', 'git add', 'stylelint --syntax=scss'],
        '*.{md,html}': ['prettier --write', 'git add'],
    },
};
