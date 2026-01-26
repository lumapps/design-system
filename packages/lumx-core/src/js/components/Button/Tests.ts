import { mdiCheck, mdiPlus } from '@lumx/icons';
import userEvent from '@testing-library/user-event';
import { getByClassName, queryAllByClassName, queryByClassName } from '../../../testing/queries';
import { Emphasis } from '../../constants';
import { SetupOptions } from '../../../testing';
import { Button, ButtonProps } from './Button';
import { Icon } from '../Icon';

const CLASSNAME = Button.className as string;

type SetupProps = Partial<ButtonProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<ButtonProps>) => {
    const props: any = { ...propsOverride };
    render(props, options);

    const button = getByClassName(document.body, CLASSNAME);
    const buttonWrapper = queryByClassName(document.body, 'lumx-button-wrapper');
    const icons = queryAllByClassName(button, Icon.className as string);
    return { props, button, buttonWrapper, icons };
};

export default (renderOptions: SetupOptions<ButtonProps>) => {
    const { screen } = renderOptions;
    describe(`<${Button.displayName}>`, () => {
        describe('Props', () => {
            it('should render default', () => {
                const label = 'Label';
                const { button, icons } = setup({ children: label }, renderOptions);
                expect(button).toBe(screen.queryByRole('button', { name: label }));
                expect(button).toHaveAttribute('type', 'button');
                expect(button.className).toMatchInlineSnapshot(
                    '"lumx-button lumx-button--color-primary lumx-button--emphasis-high lumx-button--size-m lumx-button--theme-light lumx-button--variant-button"',
                );
                expect(icons.length).toBe(0);
            });

            it('should render icons', () => {
                const label = 'Label';
                const { button, icons } = setup(
                    { children: label, rightIcon: mdiPlus, leftIcon: mdiCheck },
                    renderOptions,
                );
                expect(button).toHaveTextContent(label);
                expect(icons.length).toBe(2);
            });

            it('should render link', () => {
                const label = 'Label';
                const { button } = setup({ children: label, href: 'https://example.com' }, renderOptions);
                expect(button).toBe(screen.queryByRole('link', { name: label }));
            });

            it('should render emphasis low', () => {
                const { button } = setup({ emphasis: Emphasis.low }, renderOptions);
                expect(button.className).toMatchInlineSnapshot(
                    '"lumx-button lumx-button--color-dark lumx-button--emphasis-low lumx-button--size-m lumx-button--variant-button"',
                );
            });

            it('should render fullWidth', () => {
                const { button } = setup({ fullWidth: true }, renderOptions);
                expect(button.className).toContain('lumx-button--is-full-width');
            });

            it('should render isSelected', () => {
                const { button } = setup({ isSelected: true }, renderOptions);
                expect(button.className).toContain('lumx-button--is-selected');
            });

            it('should wrap text children in span', () => {
                const label = 'Label';
                const { button } = setup({ children: label }, renderOptions);
                expect(button.querySelector('span')).toHaveTextContent(label);
            });

            it('should call onClick', async () => {
                const onClick = vi.fn();
                const { button } = setup({ onClick }, renderOptions);
                await userEvent.click(button);
                expect(onClick).toHaveBeenCalledTimes(1);
            });

            it('should render with type submit', () => {
                const { button } = setup({ type: 'submit' }, renderOptions);
                expect(button).toHaveAttribute('type', 'submit');
            });

            it('should render link with target', () => {
                const { button } = setup({ href: 'https://example.com', target: '_blank' }, renderOptions);
                expect(button).toHaveAttribute('target', '_blank');
            });
        });

        describe('Disabled state', () => {
            it('should render disabled button', async () => {
                const onClick = vi.fn();
                const { button } = setup({ children: 'Label', disabled: true, onClick }, renderOptions);
                expect(button).toHaveAttribute('disabled');
                await userEvent.click(button);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should render disabled link', async () => {
                const onClick = vi.fn();
                const { button } = setup(
                    { children: 'Label', disabled: true, href: 'https://example.com', onClick },
                    renderOptions,
                );
                expect(screen.queryByRole('link')).toBeInTheDocument();
                expect(button).toHaveAttribute('aria-disabled', 'true');
                // Simulate standard disabled state (not focusable)
                expect(button).toHaveAttribute('tabindex', '-1');
                await userEvent.click(button);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should render aria-disabled button', async () => {
                const onClick = vi.fn();
                const { button } = setup({ children: 'Label', 'aria-disabled': true, onClick }, renderOptions);
                expect(button).toHaveAttribute('aria-disabled');
                await userEvent.click(button);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should render aria-disabled link', async () => {
                const onClick = vi.fn();
                const { button } = setup(
                    {
                        children: 'Label',
                        'aria-disabled': true,
                        href: 'https://example.com',
                        onClick,
                    },
                    renderOptions,
                );
                expect(button).toHaveAccessibleName('Label');
                expect(screen.queryByRole('link')).toBeInTheDocument();
                expect(button).toHaveAttribute('aria-disabled', 'true');
                await userEvent.click(button);
                expect(onClick).not.toHaveBeenCalled();
            });
        });
    });
};
