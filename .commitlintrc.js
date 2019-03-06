/* eslint-disable import/no-commonjs, import/unambiguous */

module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-max-line-length': [2, 'always', 100],
        'footer-max-line-length': [2, 'always', 100],
        'type-enum': [
            2,
            'always',
            ['build', 'chore', 'docs', 'feat', 'fix', 'perf', 'lint', 'refactor', 'revert', 'style', 'test'],
        ],
    },
};
