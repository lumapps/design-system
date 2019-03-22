/* eslint-disable import/no-nodejs-modules, import/no-extraneous-dependencies */

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-lumx-component:class-component', () => {
    beforeAll(() => {
        return helpers.run(path.join(__dirname, '../generators/class-component')).withPrompts({ someAnswer: true });
    });

    it('creates files', () => {
        assert.file(['dummyfile.txt']);
    });
});
