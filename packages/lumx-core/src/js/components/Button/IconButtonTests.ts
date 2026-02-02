import userEvent from '@testing-library/user-event';
import { getByClassName, queryByClassName, queryByTagName } from '@lumx/core/testing/queries';
import { SetupOptions } from '@lumx/core/testing';

import { CLASSNAME } from './Button';
import { IconButton, IconButtonProps } from './IconButton';

type SetupProps = Partial<IconButtonProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<IconButtonProps>) => {
    const props: any = { label: 'IconButton', ...propsOverride };
    render(props, options);
    const iconButton = getByClassName(document.body, CLASSNAME);
    const icon = queryByClassName(iconButton, 'lumx-icon');
    const img = queryByTagName(iconButton, 'IMG');

    return { props, iconButton, icon, img };
};

export default (renderOptions: SetupOptions<IconButtonProps>) => {
    const { screen } = renderOptions;

    describe(`<${IconButton.displayName}>`, () => {
        describe('Props', () => {
            it('should render default', () => {
                const { iconButton, icon, img } = setup(undefined, renderOptions);
                expect(iconButton).toBeInTheDocument();
                expect(iconButton.className).toMatchInlineSnapshot(
                    '"lumx-button lumx-button--color-primary lumx-button--emphasis-high lumx-button--size-m lumx-button--theme-light lumx-button--variant-icon"',
                );

                expect(icon).toBeInTheDocument();
                expect(img).not.toBeInTheDocument();
            });

            it('should render label', () => {
                const label = 'Label';
                const { iconButton } = setup({ label }, renderOptions);
                expect(iconButton).toBe(screen.queryByRole('button', { name: label }));
            });

            it('should render icon button with an image', () => {
                const { iconButton, icon, img } = setup({ image: 'http://foo.com' }, renderOptions);

                expect(iconButton).toBeInTheDocument();
                expect(icon).not.toBeInTheDocument();
                expect(img).toBeInTheDocument();
            });

            it('should render disabled button', async () => {
                const onClick = vi.fn();
                const { iconButton } = setup({ isDisabled: true, onClick }, renderOptions);
                expect(iconButton).toBeDisabled();
                await userEvent.click(iconButton);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should render with type submit', () => {
                const { iconButton } = setup({ type: 'submit' }, renderOptions);
                expect(iconButton).toHaveAttribute('type', 'submit');
            });

            it('should render as link', () => {
                const { iconButton } = setup({ href: 'https://example.com' }, renderOptions);
                expect(iconButton.tagName).toBe('A');
                expect(iconButton).toHaveAttribute('href', 'https://example.com');
            });
        });
    });
};
