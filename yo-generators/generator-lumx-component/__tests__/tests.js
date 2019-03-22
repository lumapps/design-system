/* eslint-disable import/no-nodejs-modules, import/no-extraneous-dependencies */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-lumx-component:tests', () => {
    beforeAll(() => {
        return helpers.run(path.join(__dirname, '../generators/tests')).withPrompts({ someAnswer: true });
    });

    it('creates files', () => {
        assert.file(['dummyfile.txt']);
    });
});
