import userEvent from '@testing-library/user-event';

import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-action-area__action';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, screen, ...options }: SetupOptions<any>) => {
    const props = { children: 'Label', ...propsOverride };
    render(props, options);

    const listItemAction = getByClassName(document.body, CLASSNAME);
    return { props, listItemAction, screen };
};

export default (renderOptions: SetupOptions<any>) => {
    const { screen } = renderOptions;

    describe('ListItemAction core tests', () => {
        describe('Rendering', () => {
            it('should render as a button by default', () => {
                setup({ children: 'Label' }, renderOptions);
                const button = screen.getByRole('button', { name: 'Label' });
                expect(button).toBeInTheDocument();
                expect(button.tagName).toBe('BUTTON');
            });

            it('should render as an anchor when as="a"', () => {
                setup({ as: 'a', href: '/test', children: 'Link label' }, renderOptions);
                const link = screen.getByRole('link', { name: 'Link label' });
                expect(link).toBeInTheDocument();
                expect(link.tagName).toBe('A');
                expect(link).toHaveAttribute('href', '/test');
            });
        });

        describe('Action area classes', () => {
            it('should apply action area action class', () => {
                setup({ children: 'Label' }, renderOptions);
                const button = screen.getByRole('button', { name: 'Label' });
                expect(button).toHaveClass('lumx-action-area__action');
            });

            it('should apply has-overlay modifier', () => {
                setup({ children: 'Label' }, renderOptions);
                const button = screen.getByRole('button', { name: 'Label' });
                expect(button).toHaveClass('lumx-action-area__action--has-overlay');
            });

            it('should apply focus-inset modifier', () => {
                setup({ children: 'Label' }, renderOptions);
                const button = screen.getByRole('button', { name: 'Label' });
                expect(button).toHaveClass('lumx-action-area__action--focus-inset');
            });

            it('should merge custom className with action area classes', () => {
                setup({ className: 'my-custom-class', children: 'Label' }, renderOptions);
                const button = screen.getByRole('button', { name: 'Label' });
                expect(button).toHaveClass('my-custom-class');
                expect(button).toHaveClass('lumx-action-area__action');
            });
        });

        describe('Click handling', () => {
            it('should call handleClick when clicked', async () => {
                const handleClick = vi.fn();
                setup({ handleClick, children: 'Label' }, renderOptions);
                await userEvent.click(screen.getByRole('button', { name: 'Label' }));
                expect(handleClick).toHaveBeenCalledTimes(1);
            });

            it('should not call handleClick when disabled', async () => {
                const handleClick = vi.fn();
                setup({ handleClick, disabled: true, children: 'Label' }, renderOptions);
                const button = screen.getByRole('button', { name: 'Label' });
                await userEvent.click(button);
                expect(handleClick).not.toHaveBeenCalled();
            });
        });

        describe('Props forwarding', () => {
            it('should forward native anchor props', () => {
                setup(
                    {
                        as: 'a',
                        href: 'https://example.com',
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        children: 'Label',
                    },
                    renderOptions,
                );
                const link = screen.getByRole('link', { name: 'Label' });
                expect(link).toHaveAttribute('target', '_blank');
                expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            });

            it('should forward data attributes', () => {
                setup({ 'data-testid': 'action', children: 'Label' }, renderOptions);
                expect(screen.getByTestId('action')).toBeInTheDocument();
            });

            it('should forward aria attributes', () => {
                setup({ 'aria-label': 'Custom label', children: 'Label' }, renderOptions);
                expect(screen.getByRole('button', { name: 'Custom label' })).toBeInTheDocument();
            });
        });
    });
};
