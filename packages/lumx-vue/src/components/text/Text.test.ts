import { render } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import { h } from 'vue';
import { mdiEarth } from '@lumx/icons';
import { Icon, JSXElement, Text } from '@lumx/vue';
import { getByClassName, queryAllByClassName } from '@lumx/core/testing/queries';
import { CLASSNAME } from '@lumx/core/js/components/Text';
import { commonTestsSuiteVTL, SetupRenderOptions } from '../../testing/commonTestsSuiteVTL';

type SetupProps = Partial<{ as: any; children?: any; [key: string]: any }>;

const setup = (propsOverride: SetupProps = {}, options: SetupRenderOptions<any> = {}) => {
    const { children, ...restProps } = propsOverride;

    const props = {
        as: 'span',
        ...restProps,
    };

    const slots = {
        default: children || 'Label text',
    };

    const { container } = render(Text, {
        slots,
        ...options,
        props,
    });

    const element = getByClassName(container as HTMLElement, CLASSNAME);
    return { props, container, element };
};

describe(`<Text>`, () => {
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
                children: ['Some text', h(Icon, { icon: mdiEarth }), 'with icon'] as JSXElement,
            });
            const icons = queryAllByClassName(element, Icon.className as string);
            expect(icons).toHaveLength(1);

            // Icons are all wrapped with spaces
            for (const icon of icons) {
                expect((icon.previousSibling as any).textContent).toEqual(' ');
                expect((icon.nextSibling as any).textContent).toEqual(' ');
            }
        });
    });

    // Common tests suite.
    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });
});
