module.exports = {
    '*.{js,jsx,ts,tsx}': ['prettier-eslint --prettier-last --write', 'git add', 'eslint'],
    '*.css': ['prettier-stylelint --prettier-last --write', 'git add', 'stylelint'],
    '*.scss': ['prettier-stylelint --prettier-last --write', 'git add', 'stylelint --syntax=scss'],
    '*.{md,html}': ['prettier --write', 'git add'],
};
