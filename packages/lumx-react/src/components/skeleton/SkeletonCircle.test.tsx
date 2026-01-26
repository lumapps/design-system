import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { ColorPalette } from '@lumx/react';
import { SkeletonCircle, SkeletonCircleProps } from './SkeletonCircle';

const CLASSNAME = SkeletonCircle.className as string;

const setup = (props: Partial<SkeletonCircleProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<SkeletonCircle {...(props as any)} />, { wrapper });
    const skeletonCircle = queryByClassName(document.body, CLASSNAME);
    return { props, skeletonCircle };
};

describe(`<${SkeletonCircle.displayName}>`, () => {
    describe('Props', () => {
        it('should render with size', () => {
            const { skeletonCircle } = setup({ size: 'xl' });
            expect(skeletonCircle).toHaveClass(`${CLASSNAME}--size-xl`);
        });

        it('should render with color', () => {
            const { skeletonCircle } = setup({ color: ColorPalette.primary });
            expect(skeletonCircle).toHaveClass(`${CLASSNAME}--color-primary`);
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'skeletonCircle',
        forwardAttributes: 'skeletonCircle',
        applyTheme: {
            affects: [{ element: 'skeletonCircle' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
