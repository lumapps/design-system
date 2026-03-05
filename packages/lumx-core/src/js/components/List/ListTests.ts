import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-list';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { children: 'Item', ...propsOverride };
    const wrapper = render(props, options);

    const list = getByClassName(document.body, CLASSNAME);
    return { props, list, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('List core tests', () => {
        describe('Props', () => {
            it('should render as a <ul> element', () => {
                const { list } = setup({}, renderOptions);
                expect(list.tagName).toBe('UL');
            });

            it('should apply the base class', () => {
                const { list } = setup({}, renderOptions);
                expect(list).toHaveClass(CLASSNAME);
            });

            it('should apply itemPadding class', () => {
                const { list } = setup({ itemPadding: 'big' }, renderOptions);
                expect(list).toHaveClass(`${CLASSNAME}--item-padding-big`);
            });

            it('should apply tabIndex', () => {
                const { list } = setup({ tabIndex: 0 }, renderOptions);
                expect(list).toHaveAttribute('tabindex', '0');
            });

            it('should render children', () => {
                const { list } = setup({ children: 'My Item' }, renderOptions);
                expect(list).toHaveTextContent('My Item');
            });
        });
    });
};
