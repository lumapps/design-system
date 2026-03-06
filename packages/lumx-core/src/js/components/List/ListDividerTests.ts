import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-list-divider';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const listDivider = getByClassName(document.body, CLASSNAME);
    return { props, listDivider, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('ListDivider core tests', () => {
        describe('Rendering', () => {
            it('should render as an <li> element', () => {
                const { listDivider } = setup({}, renderOptions);
                expect(listDivider.tagName).toBe('LI');
            });

            it('should have role="none"', () => {
                const { listDivider } = setup({}, renderOptions);
                expect(listDivider).toHaveAttribute('role', 'none');
            });

            it('should apply the base class', () => {
                const { listDivider } = setup({}, renderOptions);
                expect(listDivider).toHaveClass(CLASSNAME);
            });
        });
    });
};
