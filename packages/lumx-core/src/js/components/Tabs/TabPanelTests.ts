import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';

const CLASSNAME = 'lumx-tab-panel';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { children: 'Tab panel content', ...propsOverride };
    const wrapper = render(props, options);
    const tabPanel = getByClassName(document.body, CLASSNAME);
    return { props, tabPanel, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('TabPanel core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const { tabPanel } = setup({}, renderOptions);
                expect(tabPanel).toBe(screen.queryByRole('tabpanel'));
            });

            it('should render isActive', () => {
                const { tabPanel } = setup({ isActive: true }, renderOptions);
                expect(tabPanel).toHaveClass('lumx-tab-panel--is-active');
                expect(tabPanel).toHaveAttribute('tabindex', '0');
            });

            it('should render inactive tabIndex', () => {
                const { tabPanel } = setup({ isActive: false }, renderOptions);
                expect(tabPanel).toHaveAttribute('tabindex', '-1');
            });

            it('should render children when active', () => {
                const content = 'Visible content';
                setup({ children: content, isActive: true }, renderOptions);
                expect(screen.queryByText(content)).toBeInTheDocument();
            });

            it('should hide children when lazy and not active', () => {
                const content = 'Lazy content';
                setup({ children: content, isLazy: true, isActive: false }, renderOptions);
                expect(screen.queryByText(content)).not.toBeInTheDocument();
            });
        });
    });
};
