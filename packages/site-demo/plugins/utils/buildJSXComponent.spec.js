const buildJSXComponent = require('./buildJSXComponent');

describe('buildJSXComponent', () => {
    it('should build JSX with empty props', () => {
        expect(buildJSXComponent('Foo', {})).toMatchInlineSnapshot(`"<Foo />"`);
    });

    it('should build JSX with props', () => {
        const props = {
            foo: 'true',
            bar: '"string"',
            baz: '1',
        };
        expect(buildJSXComponent('Foo', props)).toMatchInlineSnapshot(
            `"<Foo foo={true} bar={\\"string\\"} baz={1} />"`,
        );
    });

    it('should build JSX with props and children', () => {
        const props = {
            foo: 'true',
            bar: '"string"',
            baz: '1',
            children: `<span>children</span>`,
        };
        expect(buildJSXComponent('Foo', props)).toMatchInlineSnapshot(
            `"<Foo foo={true} bar={\\"string\\"} baz={1}><span>children</span></Foo>"`,
        );
    });
});
