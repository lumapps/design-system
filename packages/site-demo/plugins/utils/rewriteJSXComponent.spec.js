const rewriteJSXComponents = require('./rewriteJSXComponents');

describe('rewriteJSXComponents', () => {
    it('should ignore if no component found', async () => {
        const jsx = `
            Foo bar baz

            <Bar />
        `;
        const transformFunction = jest.fn();
        expect(await rewriteJSXComponents('Foo', jsx, transformFunction)).toEqual(jsx);
        expect(transformFunction).not.toHaveBeenCalled();
    });

    it('should rewrite components', async () => {
        const jsx = `
            <Foo>
            children
            </Foo>

            Foo bar baz

            <Foo fizz />
        `;
        const transformFunction = jest.fn((e) => ({ bar: 'baz', ...e }));
        expect(await rewriteJSXComponents('Foo', jsx, transformFunction)).toMatchInlineSnapshot(`
            "
                        <Foo bar={baz}>
                        children
                        </Foo>

                        Foo bar baz

                        <Foo bar={baz} fizz={true} />
                    "
        `);
    });
});
