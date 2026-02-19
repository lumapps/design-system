import { ColorPalette, Emphasis, Size, Theme } from '@lumx/core/js/constants';

import { SetupOptions } from '@lumx/core/testing';
import { getByClassName } from '@lumx/core/testing/queries';
import { ButtonRoot, ButtonRootProps, BUTTON_CLASSNAME, BUTTON_WRAPPER_CLASSNAME } from './ButtonRoot';

type SetupProps = Partial<ButtonRootProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<ButtonRootProps>) => {
    const props: any = { variant: 'button', ...propsOverride };
    render(props, options);

    const button = getByClassName(document.body, BUTTON_CLASSNAME);
    return { props, button };
};

export default (renderOptions: SetupOptions<ButtonRootProps>) => {
    describe(`<${ButtonRoot.displayName}>`, () => {
        describe('adaptedColor logic', () => {
            it('should use provided color', () => {
                const { button } = setup({ color: ColorPalette.red }, renderOptions);
                expect(button).toHaveClass(`${BUTTON_CLASSNAME}--color-red`);
            });

            it('should default to light color when emphasis is not high and theme is dark', () => {
                const { button } = setup({ emphasis: Emphasis.low, theme: Theme.dark }, renderOptions);
                expect(button).toHaveClass(`${BUTTON_CLASSNAME}--color-light`);
            });

            it('should default to light color when emphasis is undefined and theme is dark', () => {
                const { button } = setup({ theme: Theme.dark }, renderOptions);
                expect(button).toHaveClass(`${BUTTON_CLASSNAME}--color-light`);
            });

            it('should default to primary color when emphasis is high', () => {
                const { button } = setup({ emphasis: Emphasis.high }, renderOptions);
                expect(button).toHaveClass(`${BUTTON_CLASSNAME}--color-primary`);
            });

            it('should default to dark color otherwise', () => {
                const { button } = setup(undefined, renderOptions);
                expect(button).toHaveClass(`${BUTTON_CLASSNAME}--color-dark`);
            });
        });

        it('should render as a button by default', () => {
            const { button } = setup(undefined, renderOptions);
            expect(button.tagName).toBe('BUTTON');
        });

        it('should render as a link when href is provided', () => {
            const { button } = setup({ href: 'https://example.com' }, renderOptions);
            expect(button.tagName).toBe('A');
            expect(button).toHaveAttribute('href', 'https://example.com');
        });

        it('should apply the correct class for isSelected', () => {
            const { button } = setup({ isSelected: true }, renderOptions);
            expect(button).toHaveClass(`${BUTTON_CLASSNAME}--is-selected`);
        });

        it('should apply the correct class for size', () => {
            const { button } = setup({ size: Size.s }, renderOptions);
            expect(button).toHaveClass(`${BUTTON_CLASSNAME}--size-s`);
        });

        it('should apply the correct class for emphasis', () => {
            const { button } = setup({ emphasis: Emphasis.low }, renderOptions);
            expect(button).toHaveClass(`${BUTTON_CLASSNAME}--emphasis-low`);
        });

        it('should apply the correct class for variant icon', () => {
            const { button } = setup({ variant: 'icon' }, renderOptions);
            expect(button).toHaveClass(`${BUTTON_CLASSNAME}--variant-icon`);
        });

        it('should apply the correct class for fullWidth', () => {
            const { button } = setup({ fullWidth: true }, renderOptions);
            expect(button).toHaveClass(`${BUTTON_CLASSNAME}--is-full-width`);
        });

        it('should forward aria-label', () => {
            const { button } = setup({ 'aria-label': 'Close' }, renderOptions);
            expect(button).toHaveAttribute('aria-label', 'Close');
        });

        it('should render a wrapper when hasBackground is true', () => {
            setup({ variant: 'button', hasBackground: true }, renderOptions);
            const wrapper = document.querySelector(`.${BUTTON_WRAPPER_CLASSNAME}`);
            expect(wrapper).toBeInTheDocument();
            expect(wrapper).toHaveClass(`${BUTTON_WRAPPER_CLASSNAME}--variant-button`);
        });
    });
};
