import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { ColorPalette, Typography } from '@lumx/react';
import { SkeletonTypography, SkeletonTypographyProps } from './SkeletonTypography';

const CLASSNAME = SkeletonTypography.className as string;

const setup = (props: Partial<SkeletonTypographyProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<SkeletonTypography {...(props as any)} />, { wrapper });
    const skeletonTypography = queryByClassName(document.body, CLASSNAME);
    return { props, skeletonTypography };
};

describe(`<${SkeletonTypography.displayName}>`, () => {
    describe('Props', () => {
        it('should render with typography', () => {
            const { skeletonTypography } = setup({ typography: Typography.body1 });
            expect(skeletonTypography).toHaveClass(`${CLASSNAME}--typography-body1`);
        });

        it('should render with width', () => {
            const { skeletonTypography } = setup({ width: '100px' });
            expect(skeletonTypography).toHaveStyle('width: 100px');
        });

        it('should render with color', () => {
            const { skeletonTypography } = setup({ color: ColorPalette.primary });
            expect(skeletonTypography).toHaveClass(`${CLASSNAME}--color-primary`);
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'skeletonTypography',
        forwardAttributes: 'skeletonTypography',
        applyTheme: {
            affects: [{ element: 'skeletonTypography' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
