import { SetupOptions } from '../../../testing';
import { getByClassName, queryByClassName } from '../../../testing/queries';
import { ThumbnailProps, CLASSNAME } from '.';

type SetupProps = Partial<ThumbnailProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<ThumbnailProps>) => {
    const props: ThumbnailProps = {
        alt: 'Test image',
        image: 'https://example.com/image.jpg',
        ...propsOverride,
    };

    render(props, options);

    const thumbnail = getByClassName(document.body, CLASSNAME);
    const image = thumbnail.querySelector('img');
    const background = queryByClassName(thumbnail, `${CLASSNAME}__background`);
    const badge = queryByClassName(thumbnail, `${CLASSNAME}__badge`);
    const fallback = queryByClassName(thumbnail, `${CLASSNAME}__fallback`);

    return { thumbnail, image, background, badge, fallback, props };
};

export default (renderOptions: SetupOptions<ThumbnailProps>) => {
    describe('Props', () => {
        it('should render correctly', () => {
            const { thumbnail, image, background } = setup({}, renderOptions);
            expect(thumbnail).toBeInTheDocument();
            expect(thumbnail).toHaveClass(CLASSNAME);
            expect(background).toBeInTheDocument();
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('alt', 'Test image');
            expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
        });

        it('should render with custom alt text', () => {
            const { image } = setup({ alt: 'Custom alt text' }, renderOptions);
            expect(image).toHaveAttribute('alt', 'Custom alt text');
        });

        it('should apply aspect ratio class', () => {
            const { thumbnail } = setup({ aspectRatio: 'square' }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--aspect-ratio-square`);
        });

        it('should apply size class', () => {
            const { thumbnail } = setup({ size: 'xl' }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--size-xl`);
        });

        it('should apply variant class', () => {
            const { thumbnail } = setup({ variant: 'rounded' }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--variant-rounded`);
        });

        it('should apply objectFit class', () => {
            const { thumbnail } = setup({ objectFit: 'cover' }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--object-fit-cover`);
        });

        it('should apply fillHeight class', () => {
            const { thumbnail } = setup({ fillHeight: true }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--fill-height`);
        });

        it('should apply align class', () => {
            const { thumbnail } = setup({ align: 'center' }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--align-center`);
        });

        it('should render loading skeleton', () => {
            const { thumbnail, image } = setup({ isLoading: true }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--is-loading`);
            expect(image).toHaveClass(`${CLASSNAME}__image--is-loading`);
        });

        it('should render with loadingState isLoading', () => {
            const { thumbnail, image } = setup({ loadingState: 'isLoading' }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--is-loading`);
            expect(image).toHaveClass(`${CLASSNAME}__image--is-loading`);
        });

        it('should apply focusPointStyle', () => {
            const focusPointStyle = { objectPosition: '50% 75%' };
            const { image } = setup({ focusPointStyle }, renderOptions);
            expect(image).toHaveStyle(focusPointStyle);
        });

        it('should forward imgProps to image element', () => {
            const { image } = setup(
                {
                    imgProps: {
                        width: 300,
                        height: 200,
                        className: 'custom-class',
                    },
                },
                renderOptions,
            );
            expect(image).toHaveAttribute('width', '300');
            expect(image).toHaveAttribute('height', '200');
            expect(image).toHaveClass('custom-class');
        });

        it('should apply crossOrigin attribute', () => {
            const { image } = setup({ crossOrigin: 'anonymous' }, renderOptions);
            expect(image).toHaveAttribute('crossOrigin', 'anonymous');
        });

        it('should apply loading attribute', () => {
            const { image } = setup({ loading: 'eager' }, renderOptions);
            expect(image).toHaveAttribute('loading', 'eager');
        });

        it('should apply theme class', () => {
            const { thumbnail } = setup({ theme: 'dark' }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--theme-dark`);
        });
    });

    describe('Badge', () => {
        it('should not render badge by default', () => {
            const { badge, thumbnail } = setup({}, renderOptions);
            expect(badge).not.toBeInTheDocument();
            expect(thumbnail).not.toHaveClass(`${CLASSNAME}--has-badge`);
        });
    });

    describe('Error fallback', () => {
        it('should not show fallback by default', () => {
            const { fallback, thumbnail } = setup({}, renderOptions);
            expect(fallback).not.toBeInTheDocument();
            expect(thumbnail).not.toHaveClass(`${CLASSNAME}--has-error`);
        });

        it('should show fallback on error with icon', () => {
            const { fallback, thumbnail, image } = setup({ loadingState: 'hasError' }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--has-error`);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--has-icon-error-fallback`);
            expect(fallback).toBeInTheDocument();
            expect(image).toHaveStyle({ visibility: 'hidden' });
        });

        it('should not show fallback when loading', () => {
            const { fallback } = setup({ loadingState: 'isLoading' }, renderOptions);
            expect(fallback).not.toBeInTheDocument();
        });
    });

    describe('Clickable rendering', () => {
        it('should render as div by default', () => {
            const { thumbnail } = setup({}, renderOptions);
            expect(thumbnail.tagName).toBe('DIV');
            expect(thumbnail).not.toHaveClass(`${CLASSNAME}--is-clickable`);
        });

        it('should render with clickable class when linkProps.href is provided', () => {
            const { thumbnail } = setup({ linkProps: { href: 'https://example.com' } }, renderOptions);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--is-clickable`);
        });

        it('should not render as clickable when disabled', () => {
            const { thumbnail } = setup({ linkProps: { href: '#' }, isAnyDisabled: true }, renderOptions);
            expect(thumbnail).not.toHaveClass(`${CLASSNAME}--is-clickable`);
            expect(thumbnail.tagName).toBe('DIV');
        });
    });
};
