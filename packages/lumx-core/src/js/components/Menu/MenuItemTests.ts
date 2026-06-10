import userEvent from '@testing-library/user-event';

import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

import { CLASSNAME } from './MenuItem';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, screen, ...options }: SetupOptions<any>) => {
    const props = { children: 'Label', ...propsOverride };
    render(props, options);

    const menuItem = getByClassName(document.body, CLASSNAME);
    const action = menuItem.querySelector('[data-menu-item]') as HTMLElement;
    return { props, menuItem, action, screen };
};

export function menuItemTests(renderOptions: SetupOptions<any>) {
    const { screen } = renderOptions;

    describe('MenuItem core tests', () => {
        describe('Rendering', () => {
            it('should render with base class name', () => {
                const { menuItem } = setup({}, renderOptions);
                expect(menuItem).toBeInTheDocument();
                expect(menuItem).toHaveClass(CLASSNAME);
            });

            it('should have action element with data-menu-item attribute', () => {
                const { action } = setup({}, renderOptions);
                expect(action).toBeInTheDocument();
            });

            it('should render children text content', () => {
                setup({ children: 'Item label' }, renderOptions);
                expect(screen.getByRole('button', { name: 'Item label' })).toBeInTheDocument();
            });
        });

        describe('Click handling', () => {
            it('should call handleClick on click', async () => {
                const handleClick = vi.fn();
                setup({ handleClick, children: 'Clickable' }, renderOptions);
                await userEvent.click(screen.getByRole('button', { name: 'Clickable' }));
                expect(handleClick).toHaveBeenCalledTimes(1);
            });

            it('should not call handleClick when disabled', async () => {
                const handleClick = vi.fn();
                setup({ handleClick, isDisabled: true, children: 'Disabled' }, renderOptions);
                const button = screen.getByRole('button', { name: 'Disabled' });
                await userEvent.click(button);
                expect(handleClick).not.toHaveBeenCalled();
            });
        });

        describe('Disabled state', () => {
            it('should set aria-disabled when isDisabled is true', () => {
                setup({ isDisabled: true, children: 'Disabled' }, renderOptions);
                const button = screen.getByRole('button', { name: 'Disabled' });
                expect(button).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not set aria-disabled when isDisabled is not set', () => {
                setup({ children: 'Enabled' }, renderOptions);
                const button = screen.getByRole('button', { name: 'Enabled' });
                expect(button).not.toHaveAttribute('aria-disabled');
            });
        });
    });
}
