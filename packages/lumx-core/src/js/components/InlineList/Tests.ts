import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';

const CLASSNAME = 'lumx-inline-list';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const inlineList = getByClassName(document.body, CLASSNAME);
    const ul = inlineList; // Alias for commonTestsSuite compatibility
    return { props, inlineList, ul, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('InlineList core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const { inlineList } = setup({ items: ['Item 1', 'Item 2'] }, renderOptions);

                expect(inlineList).toBeInTheDocument();

                const list = screen.getByRole('list');
                expect(list).toBeInTheDocument();

                const listItems = screen.getAllByRole('listitem');
                expect(listItems.length).toBe(2);
                expect(listItems[0]).toHaveTextContent('Item 1');
                expect(listItems[1]).toHaveTextContent('Item 2');
            });

            it('should render with typography', () => {
                const { inlineList } = setup({ items: ['Some text'], typography: 'body2' }, renderOptions);
                expect(inlineList).toHaveClass('lumx-typography-body2');
            });

            it('should render with color', () => {
                const { inlineList } = setup({ items: ['Some text'], color: 'blue' }, renderOptions);
                expect(inlineList).toHaveClass('lumx-color-font-blue-N');
            });

            it('should render with color and variant', () => {
                const { inlineList } = setup(
                    { items: ['Some text'], color: 'blue', colorVariant: 'D2' },
                    renderOptions,
                );
                expect(inlineList).toHaveClass('lumx-color-font-blue-D2');
            });

            it('should apply wrap class', () => {
                const { inlineList } = setup({ items: ['Some text'], wrap: true }, renderOptions);
                expect(inlineList).toHaveClass(`${CLASSNAME}--wrap`);
            });

            it('should render separators between items', () => {
                setup({ items: ['Item 1', 'Item 2', 'Item 3'] }, renderOptions);
                const separators = document.querySelectorAll(`.${CLASSNAME}__item-separator`);
                expect(separators.length).toBe(2);
                expect(separators[0].textContent).toMatch(/•/);
            });
        });
    });
};
