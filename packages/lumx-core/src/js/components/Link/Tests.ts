import { ColorPalette, ColorVariant } from '@lumx/core/js/constants';

import { SetupOptions } from '../../../testing';
import { getByClassName, queryByClassName } from '../../../testing/queries';
import { LinkProps, CLASSNAME } from '.';

type SetupProps = Partial<LinkProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<LinkProps>) => {
    const props: LinkProps = {
        ...propsOverride,
    };

    render(props, options);

    const link = getByClassName(document.body, CLASSNAME);
    const rightIcon = queryByClassName(link, `${CLASSNAME}__right-icon`);
    const leftIcon = queryByClassName(link, `${CLASSNAME}__left-icon`);
    const content = queryByClassName(link, `${CLASSNAME}__content`);

    return { link, rightIcon, leftIcon, content, props };
};

export default (renderOptions: SetupOptions<LinkProps>) => {
    describe('Props', () => {
        it('should render link with href', () => {
            const { link, rightIcon, leftIcon } = setup({ href: 'https://example.com', label: 'Link' }, renderOptions);

            expect(link).toBeInTheDocument();
            expect(link).toHaveClass(CLASSNAME);
            expect(link).toHaveAttribute('href', 'https://example.com');
            expect(link.tagName).toBe('A');

            expect(rightIcon).not.toBeInTheDocument();
            expect(leftIcon).not.toBeInTheDocument();
        });

        it('should render as button without href', () => {
            const { link } = setup({ label: 'Link' }, renderOptions);

            expect(link).toBeInTheDocument();
            expect(link.tagName).toBe('BUTTON');
            expect(link).not.toHaveAttribute('href');
        });

        it('should render color & color variant', () => {
            const { link } = setup(
                {
                    href: 'https://google.com',
                    color: ColorPalette.primary,
                    colorVariant: ColorVariant.D1,
                },
                renderOptions,
            );
            expect(link).toHaveClass('lumx-link--color-primary');
            expect(link).toHaveClass('lumx-link--color-variant-D1');
        });

        it('should render typography', () => {
            const { link } = setup({ href: 'https://google.com', typography: 'title' }, renderOptions);
            expect(link).toHaveClass('lumx-link--has-typography');
            expect(link).toHaveClass('lumx-typography-title');
        });

        it('should render as custom element', () => {
            const { link } = setup({ as: 'span', label: 'Link' }, renderOptions);
            expect(link.tagName).toBe('SPAN');
        });

        it('should forward target prop to anchor', () => {
            const { link } = setup({ href: 'https://example.com', target: '_blank', label: 'Link' }, renderOptions);
            expect(link).toHaveAttribute('target', '_blank');
        });

        it('should render content in span', () => {
            const { content } = setup({ label: 'Link text' }, renderOptions);
            expect(content).toBeInTheDocument();
            expect(content).toHaveTextContent('Link text');
        });
    });

    describe('Disabled state', () => {
        it('should render disabled button', () => {
            const { link } = setup({ label: 'Label', isDisabled: true }, renderOptions);
            expect(link.tagName).toBe('BUTTON');
            expect(link).toHaveAttribute('disabled');
        });

        it('should render disabled link with aria-disabled', () => {
            const { link } = setup({ label: 'Label', isDisabled: true, href: 'https://example.com' }, renderOptions);
            expect(link.tagName).toBe('A');
            expect(link).toHaveAttribute('aria-disabled', 'true');
            expect(link).toHaveAttribute('tabindex', '-1');
        });

        it('should not trigger onClick when disabled', () => {
            const onClick = vi.fn();
            const { link } = setup({ label: 'Label', isDisabled: true, onClick }, renderOptions);

            link.click();

            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('Icons', () => {
        it('should render left icon', () => {
            const { leftIcon } = setup({ leftIcon: 'M10,10 L20,20', label: 'Link' }, renderOptions);
            expect(leftIcon).toBeInTheDocument();
        });

        it('should render right icon', () => {
            const { rightIcon } = setup({ rightIcon: 'M10,10 L20,20', label: 'Link' }, renderOptions);
            expect(rightIcon).toBeInTheDocument();
        });

        it('should render both icons', () => {
            const { leftIcon, rightIcon } = setup(
                {
                    leftIcon: 'M10,10 L20,20',
                    rightIcon: 'M30,30 L40,40',
                    label: 'Link',
                },
                renderOptions,
            );
            expect(leftIcon).toBeInTheDocument();
            expect(rightIcon).toBeInTheDocument();
        });
    });
};
