import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-popover-dialog';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { isOpen: true, usePortal: false, 'aria-label': 'Dialog', ...propsOverride };
    const wrapper = render(props, options);
    const element = getByClassName(document.body, CLASSNAME);
    return { props, element, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('PopoverDialog core tests', () => {
        describe('Props', () => {
            it('should render with base class name', () => {
                const { element } = setup({}, renderOptions);
                expect(element).toBeInTheDocument();
                expect(element.className).toContain(CLASSNAME);
            });

            it('should have role="dialog"', () => {
                const { element } = setup({}, renderOptions);
                expect(element).toHaveAttribute('role', 'dialog');
            });

            it('should have aria-modal="true"', () => {
                const { element } = setup({}, renderOptions);
                expect(element).toHaveAttribute('aria-modal', 'true');
            });

            it('should forward aria-label', () => {
                const { element } = setup({ 'aria-label': 'Custom label' }, renderOptions);
                expect(element).toHaveAttribute('aria-label', 'Custom label');
            });

            it('should use label prop as aria-label', () => {
                const { element } = setup({ label: 'Label prop', 'aria-label': undefined }, renderOptions);
                expect(element).toHaveAttribute('aria-label', 'Label prop');
            });

            it('should prefer label prop over aria-label', () => {
                const { element } = setup({ label: 'Label prop', 'aria-label': 'Aria label' }, renderOptions);
                expect(element).toHaveAttribute('aria-label', 'Label prop');
            });
        });
    });
};
