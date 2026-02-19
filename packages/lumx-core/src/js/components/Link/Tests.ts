import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { ColorPalette, ColorVariant, Typography } from '../../constants';

const CLASSNAME = 'lumx-link';

export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const link = getByClassName(document.body, CLASSNAME);
    return { props, link, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('Link core tests', () => {
        describe('Props', () => {
            it('should render link with href', () => {
                const { link } = setup({ href: 'https://example.com', children: 'Link' }, renderOptions);

                expect(link.tagName).toBe('A');
                expect(link).toHaveAttribute('href', 'https://example.com');
                expect(link.className).toBe('lumx-link');
            });

            it('should render button without href', () => {
                const { link } = setup({ children: 'Link' }, renderOptions);

                expect(link.tagName).toBe('BUTTON');
                expect(link).toHaveAttribute('type', 'button');
                expect(link.className).toBe('lumx-link');
            });

            it('should render color & color variant', () => {
                const { link } = setup(
                    {
                        href: 'https://example.com',
                        color: ColorPalette.primary,
                        colorVariant: ColorVariant.D1,
                        children: 'Link',
                    },
                    renderOptions,
                );
                expect(link.className).toBe('lumx-link lumx-link--color-primary lumx-link--color-variant-D1');
            });

            it('should render typography', () => {
                const { link } = setup(
                    { href: 'https://example.com', typography: Typography.title, children: 'Link' },
                    renderOptions,
                );
                expect(link.className).toBe('lumx-link lumx-link--has-typography lumx-typography-title');
            });

            it('should render as a different element via linkAs', () => {
                const { link } = setup({ linkAs: 'span', children: 'Link' }, renderOptions);
                expect(link.tagName).toBe('SPAN');
            });

            it('should forward target prop to anchor', () => {
                const { link } = setup(
                    { href: 'https://example.com', target: '_blank', children: 'Link' },
                    renderOptions,
                );
                expect(link).toHaveAttribute('target', '_blank');
            });
        });

        describe('Disabled state', () => {
            it('should render disabled button', () => {
                const { link } = setup({ children: 'Label', isDisabled: true }, renderOptions);
                expect(link.tagName).toBe('BUTTON');
                expect(link).toHaveAttribute('disabled');
                expect(link).toHaveAttribute('aria-disabled', 'true');
            });

            it('should render disabled link', () => {
                const { link } = setup(
                    { children: 'Label', isDisabled: true, href: 'https://example.com' },
                    renderOptions,
                );
                expect(link.tagName).toBe('A');
                expect(link).toHaveAttribute('aria-disabled', 'true');
                expect(link).toHaveAttribute('tabindex', '-1');
            });

            it('should render aria-disabled button', () => {
                const { link } = setup({ children: 'Label', 'aria-disabled': true }, renderOptions);
                expect(link.tagName).toBe('BUTTON');
                expect(link).toHaveAttribute('aria-disabled', 'true');
                expect(link).not.toHaveAttribute('disabled');
            });

            it('should render aria-disabled link', () => {
                const { link } = setup(
                    { children: 'Label', 'aria-disabled': true, href: 'https://example.com' },
                    renderOptions,
                );
                expect(link.tagName).toBe('A');
                expect(link).toHaveAttribute('aria-disabled', 'true');
            });
        });
    });
};
