/* eslint-disable import/no-commonjs, import/unambiguous */

module.exports = {
    concurrent: true,
    linters: {
        '*.{js,jsx}': ['prettier-eslint --prettier-last --write', 'git add', 'eslint'],
        '*.{ts,tsx}': ['prettier --write', 'git add', 'tslint'],
        '*.css': ['prettier --write', 'git add', 'stylelint'],
        '*.{scss}': ['prettier --write', 'git add', 'stylelint --syntax=scss'],
        '*.{md,html}': ['prettier --write', 'git add'],
    },
};
