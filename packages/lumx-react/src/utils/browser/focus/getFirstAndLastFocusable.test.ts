import { getFirstAndLastFocusable } from './getFirstAndLastFocusable';

function htmlToElement(html: string): any {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

describe(getFirstAndLastFocusable.name, () => {
    it('should get empty', () => {
        const element = htmlToElement('<div></div>');
        const focusable = getFirstAndLastFocusable(element);
        expect(focusable).toEqual({});
    });

    it('should get single item', () => {
        const element = htmlToElement('<div><button /></div>');
        const focusable = getFirstAndLastFocusable(element);
        expect(focusable.last).toBe(focusable.first);
    });

    it('should get first and last', () => {
        const element = htmlToElement(`
            <div>
                <div>Non focusable div</div>
                <button>Simple button</button>
                <div>Non focusable div</div>
                <input />
                <div>Non focusable div</div>
            </div>
        `);
        const focusable = getFirstAndLastFocusable(element);
        expect(focusable.first).toMatchInlineSnapshot(`
            <button>
              Simple button
            </button>
        `);
        expect(focusable.first).toMatchInlineSnapshot(`
            <button>
              Simple button
            </button>
        `);
    });

    describe('match focusable elements', () => {
        it('should match input element', () => {
            const element = htmlToElement('<div><input /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot('<input />');
        });

        it('should match link element', () => {
            const element = htmlToElement('<div><a href="#" /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot(`
                <a
                  href="#"
                />
            `);
        });

        it('should match textarea element', () => {
            const element = htmlToElement('<div><textarea /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot(`
                <textarea>
                  &lt;/div&gt;
                </textarea>
            `);
        });

        it('should match element with tabindex', () => {
            const element = htmlToElement('<div><span tabindex="0" /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot(`
                <span
                  tabindex="0"
                />
            `);
        });

        it('should keep disabled=false', () => {
            const element = htmlToElement('<div><button disabled="false" /><button /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot(`
                <button
                  disabled="false"
                />
            `);
        });

        it('should keep aria-disabled=false', () => {
            const element = htmlToElement('<div><button aria-disabled="false" /><button /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot(`
                <button
                  aria-disabled="false"
                />
            `);
        });
    });

    describe('skip disabled elements', () => {
        it('should skip disabled', () => {
            const element = htmlToElement('<div><button disabled /><button /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot('<button />');
        });

        it('should skip aria-disabled', () => {
            const element = htmlToElement('<div><button aria-disabled /><button /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot('<button />');
        });

        it('should skip tabindex=-1', () => {
            const element = htmlToElement('<div><button tabindex="-1" /><button /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot('<button />');
        });

        it('should skip input type hidden', () => {
            const element = htmlToElement('<div><input type="hidden" /><button /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot('<button />');
        });

        it('should skip hidden input', () => {
            const element = htmlToElement('<div><input hidden /><button /></div>');
            const focusable = getFirstAndLastFocusable(element);
            expect(focusable.first).toMatchInlineSnapshot('<button />');
        });
    });
});
