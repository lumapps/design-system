import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { ColorPalette, Size } from '@lumx/react';
import { SkeletonRectangle, SkeletonRectangleProps, SkeletonRectangleVariant } from './SkeletonRectangle';

const CLASSNAME = SkeletonRectangle.className as string;

const setup = (props: Partial<SkeletonRectangleProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<SkeletonRectangle {...(props as any)} />, { wrapper });
    const skeletonRectangle = queryByClassName(document.body, CLASSNAME);
    return { props, skeletonRectangle };
};

describe(`<${SkeletonRectangle.displayName}>`, () => {
    describe('Props', () => {
        it('should render with variant', () => {
            const { skeletonRectangle } = setup({ variant: SkeletonRectangleVariant.rounded });
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--variant-rounded`);
        });

        it('should render with aspectRatio', () => {
            const { skeletonRectangle } = setup({ aspectRatio: 'square' });
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--aspect-ratio-square`);
        });

        it('should render with color', () => {
            const { skeletonRectangle } = setup({ color: ColorPalette.primary });
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--color-primary`);
        });

        it('should render with size', () => {
            const { skeletonRectangle } = setup({ width: Size.m, height: Size.s });
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--width-m`);
            expect(skeletonRectangle).toHaveClass(`${CLASSNAME}--height-s`);
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'skeletonRectangle',
        forwardAttributes: 'skeletonRectangle',
        applyTheme: {
            affects: [{ element: 'skeletonRectangle' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
