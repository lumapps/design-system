import { SetupOptions } from '../../../testing';
import { getByClassName, queryByClassName } from '../../../testing/queries';
import { SkeletonRectangleProps, CLASSNAME } from './SkeletonRectangle';

type SetupProps = Partial<SkeletonRectangleProps>;

/**
 * Mounts the SkeletonRectangle component and returns common DOM elements needed in tests.
 */
export const setup = (
    propsOverride: SetupProps = {},
    { render, ...options }: SetupOptions<SkeletonRectangleProps>,
) => {
    const props: SkeletonRectangleProps = {
        ...propsOverride,
    };

    render(props, options);

    const skeletonRectangle = getByClassName(document.body, CLASSNAME);
    const inner = queryByClassName(skeletonRectangle, `${CLASSNAME}__inner`);

    return { skeletonRectangle, inner, props };
};

export default (renderOptions: SetupOptions<SkeletonRectangleProps>) => {
    describe('Props', () => {
        it('should render with variant', () => {
            const { skeletonRectangle } = setup({ variant: 'rounded' }, renderOptions);
            expect(skeletonRectangle).toBeInTheDocument();
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--variant-rounded`);
        });

        it('should render with default variant', () => {
            const { skeletonRectangle } = setup({}, renderOptions);
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--variant-squared`);
        });

        it('should render with aspectRatio', () => {
            const { skeletonRectangle } = setup({ aspectRatio: 'square' }, renderOptions);
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--aspect-ratio-square`);
        });

        it('should render with color', () => {
            const { skeletonRectangle } = setup({ color: 'primary' }, renderOptions);
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--color-primary`);
        });

        it('should render with size', () => {
            const { skeletonRectangle } = setup({ width: 'm', height: 's' }, renderOptions);
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--width-m`);
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--height-s`);
        });

        it('should render with theme', () => {
            const { skeletonRectangle } = setup({ theme: 'dark' }, renderOptions);
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--theme-dark`);
        });

        it('should render inner element', () => {
            const { inner } = setup({}, renderOptions);
            expect(inner).toBeInTheDocument();
        });
    });
};
