import userEvent from '@testing-library/user-event';
import { getByClassName, queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-popover';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { isOpen: true, usePortal: false, children: 'Popover content', ...propsOverride };
    const wrapper = render(props, options);
    const element = getByClassName(document.body, CLASSNAME);
    return { props, element, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('Popover core tests', () => {
        it('should render with base class name', () => {
            const { element } = setup({}, renderOptions);
            expect(element).toBeInTheDocument();
            expect(element.className).toContain(CLASSNAME);
        });

        it('should not render when closed (closeMode unmount)', () => {
            const { render: renderFn } = renderOptions;
            renderFn({ isOpen: false, usePortal: false, children: 'Popover content' });
            const element = queryByClassName(document.body, CLASSNAME);
            expect(element).not.toBeInTheDocument();
        });

        it('should keep element in DOM but hidden when closed with closeMode hide', () => {
            const { render: renderFn } = renderOptions;
            renderFn({ isOpen: false, closeMode: 'hide', usePortal: false, children: 'Popover content' });
            const element = queryByClassName(document.body, CLASSNAME);
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass(`${CLASSNAME}--is-hidden`);
        });

        describe('Props', () => {
            it('should render arrow', () => {
                const { element } = setup({ hasArrow: true }, renderOptions);
                expect(queryByClassName(element, `${CLASSNAME}__arrow`)).toBeInTheDocument();
            });

            it('should apply elevation', () => {
                const { element } = setup({ elevation: 5 }, renderOptions);
                expect(element).toHaveClass(`${CLASSNAME}--elevation-5`);
            });

            it('should apply default elevation', () => {
                const { element } = setup({}, renderOptions);
                expect(element).toHaveClass(`${CLASSNAME}--elevation-3`);
            });

            it('should render with custom component', () => {
                const { element } = setup({ as: 'span' }, renderOptions);
                expect(element).toBeInTheDocument();
                expect(element.tagName).toBe('SPAN');
            });
        });

        describe('Portal', () => {
            it('should render in portal', () => {
                const { element } = setup({ usePortal: true }, renderOptions);
                expect(element).toBeInTheDocument();
                expect(element).toHaveTextContent(/Popover content/);
                expect(element.parentElement).toBe(document.body);
            });

            it('should render inline', () => {
                const { element, wrapper } = setup({ usePortal: false }, renderOptions);
                expect(element).toBeInTheDocument();
                expect(element).toHaveTextContent(/Popover content/);
                expect(element.parentElement).toBe(wrapper.container);
            });
        });

        it('should close on escape', async () => {
            const onClose = vi.fn();
            setup({ isOpen: true, closeOnEscape: true, onClose }, renderOptions);
            await userEvent.keyboard('{Escape}');
            expect(onClose).toHaveBeenCalled();
        });

        it('should close on escape with closeMode hide', async () => {
            const onClose = vi.fn();
            setup({ isOpen: true, closeMode: 'hide', closeOnEscape: true, onClose }, renderOptions);
            await userEvent.keyboard('{Escape}');
            expect(onClose).toHaveBeenCalled();
        });
    });
};
