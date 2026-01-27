import { getByClassName } from '@lumx/core/testing/queries';
import { SetupOptions } from '@lumx/core/testing';
import { TextProps, CLASSNAME } from '.';

type SetupProps = Partial<TextProps>;

export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<TextProps>) => {
    const props: TextProps = {
        children: propsOverride.dangerouslySetInnerHTML ? undefined : 'Label text',
        htmlFor: '123',
        as: 'span',
        ...propsOverride,
    };

    const { container } = render(props, options);
    const element = getByClassName(container, CLASSNAME);
    return { props, container, element };
};

export default (renderOptions: SetupOptions<TextProps>) => {
    describe('<Text>', () => {
        describe('Render', () => {
            it('should render default', () => {
                const { element } = setup({ children: 'Some text' }, renderOptions);
                expect(element.tagName).toBe('SPAN');
            });

            it('should render with as', () => {
                const { element } = setup({ children: 'Some text', as: 'p' }, renderOptions);
                expect(element.tagName).toBe('P');
            });

            it('should render with typography', () => {
                const { element } = setup({ typography: 'body2', children: 'Some text' }, renderOptions);
                expect(element.tagName).toBe('SPAN');
                expect(element).toHaveClass('lumx-typography-body2');
            });

            it('should render with color', () => {
                const { element } = setup({ color: 'blue', children: 'Some text' }, renderOptions);
                expect(element.tagName).toBe('SPAN');
                expect(element).toHaveClass('lumx-color-font-blue-N');
            });

            it('should render with color and variant', () => {
                const { element } = setup({ color: 'blue', colorVariant: 'D2', children: 'Some text' }, renderOptions);
                expect(element.tagName).toBe('SPAN');
                expect(element).toHaveClass('lumx-color-font-blue-D2');
            });

            it('should render truncated', () => {
                const { element } = setup({ truncate: true }, renderOptions);
                expect(element.tagName).toBe('SPAN');
                expect(element).toHaveClass('lumx-text--is-truncated');
            });

            it('should render truncated multiline', () => {
                const { element } = setup({ truncate: { lines: 2 } }, renderOptions);
                expect(element.tagName).toBe('SPAN');
                expect(element).toHaveClass('lumx-text--is-truncated-multiline');
                expect(element).toHaveAttribute('style', expect.stringContaining('--lumx-text-truncate-lines: 2'));
            });

            it('should render noWrap', () => {
                const { element } = setup({ noWrap: true }, renderOptions);
                expect(element.tagName).toBe('SPAN');
                expect(element).toHaveClass('lumx-text--no-wrap');
            });

            it('should render with custom whiteSpace', () => {
                const { element } = setup({ whiteSpace: 'pre-wrap' }, renderOptions);
                expect(element.tagName).toBe('SPAN');
                expect(element).toHaveStyle({ '--lumx-text-white-space': 'pre-wrap' });
            });
        });
    });
};
