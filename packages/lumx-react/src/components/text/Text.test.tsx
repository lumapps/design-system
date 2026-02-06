import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { mdiEarth } from '@lumx/icons';
import { Icon } from '@lumx/react';
import { render } from '@testing-library/react';
import { getByClassName, queryAllByClassName } from '@lumx/react/testing/utils/queries';
import { Text, TextProps } from '.';

type SetupProps = Partial<TextProps>;

const setup = (propsOverride: SetupProps = {}, options: SetupRenderOptions = {}) => {
    const props: TextProps = {
        children: propsOverride.dangerouslySetInnerHTML ? undefined : 'Label text',
        as: 'span',
        ...propsOverride,
    };

    const { container } = render(<Text {...props} />, options);
    const element = getByClassName(container, Text.className as string);
    return { props, container, element };
};

describe(`<${Text.displayName}>`, () => {
    describe('Render', () => {
        it('should render default', () => {
            const { element } = setup({ children: 'Some text' });
            expect(element.tagName).toBe('SPAN');
        });

        it('should render with as', () => {
            const { element } = setup({ children: 'Some text', as: 'p' });
            expect(element.tagName).toBe('P');
        });

        it('should render with typography', () => {
            const { element } = setup({ typography: 'body2', children: 'Some text' });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-typography-body2');
        });

        it('should render with color', () => {
            const { element } = setup({ color: 'blue', children: 'Some text' });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-color-font-blue-N');
        });

        it('should render with color and variant', () => {
            const { element } = setup({ color: 'blue', colorVariant: 'D2', children: 'Some text' });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-color-font-blue-D2');
        });

        it('should render truncated', () => {
            const { element } = setup({ truncate: true });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-text--is-truncated');
        });

        it('should render truncated multiline', () => {
            const { element } = setup({ truncate: { lines: 2 } });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-text--is-truncated-multiline');
            expect(element).toHaveAttribute('style', expect.stringContaining('--lumx-text-truncate-lines: 2'));
        });

        it('should render noWrap', () => {
            const { element } = setup({ noWrap: true });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-text--no-wrap');
        });

        it('should render with custom whiteSpace', () => {
            const { element } = setup({ whiteSpace: 'pre-wrap' });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveStyle({ '--lumx-text-white-space': 'pre-wrap' });
        });

        it('should wrap icons with spaces', () => {
            const { element } = setup({
                children: ['Some text', <Icon key="icon" icon={mdiEarth} />, 'with icon'],
            });
            const icons = queryAllByClassName(element, Icon.className as string);
            expect(icons).toHaveLength(1);

            // Icons are all wrapped with spaces
            for (const icon of icons) {
                expect((icon.previousSibling as any).textContent).toEqual(' ');
                expect((icon.nextSibling as any).textContent).toEqual(' ');
            }
        });

        it('should render dangerouslySetInnerHTML', () => {
            const { element } = setup({ dangerouslySetInnerHTML: { __html: '<strong>HTML text</strong>' } });
            expect(element).toHaveTextContent('HTML text');
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: Text.className as string,
        forwardClassName: 'element',
        forwardAttributes: 'element',
    });
});
