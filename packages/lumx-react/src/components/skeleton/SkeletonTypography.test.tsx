import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { SkeletonTypography, SkeletonTypographyProps } from './SkeletonTypography';

const CLASSNAME = SkeletonTypography.className as string;

const setup = (props: Partial<SkeletonTypographyProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<SkeletonTypography {...(props as any)} />, { wrapper });
    const skeletonTypography = queryByClassName(document.body, CLASSNAME);
    return { props, skeletonTypography };
};

describe(`<${SkeletonTypography.displayName}>`, () => {
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
