import userEvent from '@testing-library/user-event';

import { RawClickableProps } from '.';

import { SetupOptions } from '../../../testing';

type SetupProps = Partial<RawClickableProps<any>>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (
    propsOverride: SetupProps = {},
    { render, screen, ...options }: SetupOptions<RawClickableProps<any>>,
) => {
    const props: RawClickableProps<any> = {
        children: 'Helper text',
        'data-testid': 'raw-element',
        ...propsOverride,
    };

    render(props, options);

    const element = screen.getByTestId('raw-element');

    return { element, props };
};

export default (renderOptions: SetupOptions<RawClickableProps<any>>) => {
    const { screen } = renderOptions;

    describe(`<RawClickable>`, () => {
        describe('as a button', () => {
            it('should render a button by default', () => {
                const { element } = setup({ as: 'button', children: 'Click me' }, renderOptions);
                expect(element.tagName).toBe('BUTTON');
                expect(element).toHaveAttribute('type', 'button');
                expect(screen.getByRole('button', { name: 'Click me' })).toBe(element);
            });

            it('should trigger onClick', async () => {
                const onClick = vi.fn();
                const { element } = setup({ as: 'button', children: 'Click me', onClick }, renderOptions);
                await userEvent.click(element);
                expect(onClick).toHaveBeenCalledTimes(1);
            });

            it('should be disabled with `disabled` prop', async () => {
                const onClick = vi.fn();
                const { element } = setup(
                    { as: 'button', children: 'Click me', onClick, disabled: true },
                    renderOptions,
                );
                expect(element).toBeDisabled();
                await userEvent.click(element);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should be disabled with `isDisabled` prop', async () => {
                const onClick = vi.fn();
                const { element } = setup(
                    { as: 'button', children: 'Click me', onClick, isDisabled: true },
                    renderOptions,
                );
                expect(element).toBeDisabled();
                await userEvent.click(element);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should be aria-disabled with `aria-disabled` prop', async () => {
                const onClick = vi.fn();
                const { element } = setup(
                    { as: 'button', children: 'Click me', onClick, 'aria-disabled': true },
                    renderOptions,
                );
                expect(element).not.toBeDisabled();
                expect(element).toHaveAttribute('aria-disabled', 'true');
                await userEvent.click(element);
                expect(onClick).not.toHaveBeenCalled();
            });
        });

        describe('as a link', () => {
            const href = 'https://example.com';

            it('should render a link with `href` prop', () => {
                const { element } = setup({ as: 'a', children: 'Click me', href }, renderOptions);
                expect(element.tagName).toBe('A');
                expect(element).toHaveAttribute('href', href);
                expect(screen.getByRole('link', { name: 'Click me' })).toBe(element);
            });

            it('should trigger onClick', async () => {
                const onClick = vi.fn((evt: any) => evt.preventDefault());
                const { element } = setup({ as: 'a', children: 'Click me', href, onClick }, renderOptions);
                await userEvent.click(element);
                expect(onClick).toHaveBeenCalledTimes(1);
            });

            it('should be disabled with `disabled` prop', async () => {
                const onClick = vi.fn();
                const { element } = setup(
                    { as: 'a', children: 'Click me', href, onClick, disabled: true },
                    renderOptions,
                );
                expect(element).toHaveAttribute('aria-disabled', 'true');
                expect(element).toHaveAttribute('tabindex', '-1');
                await userEvent.click(element);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should be disabled with `isDisabled` prop', async () => {
                const onClick = vi.fn();
                const { element } = setup(
                    { as: 'a', children: 'Click me', href, onClick, isDisabled: true },
                    renderOptions,
                );
                expect(element).toHaveAttribute('aria-disabled', 'true');
                expect(element).toHaveAttribute('tabindex', '-1');
                await userEvent.click(element);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should be aria-disabled with `aria-disabled` prop', async () => {
                const onClick = vi.fn();
                const { element } = setup(
                    { as: 'a', children: 'Click me', href, onClick, 'aria-disabled': true },
                    renderOptions,
                );
                expect(element).toHaveAttribute('aria-disabled', 'true');
                await userEvent.click(element);
                expect(onClick).not.toHaveBeenCalled();
            });
        });
    });
};
