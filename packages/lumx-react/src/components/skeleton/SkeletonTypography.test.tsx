import { render, screen } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import BaseSkeletonTypographyTests from '@lumx/core/js/components/Skeleton/SkeletonTypographyTests';
import type { SkeletonTypographyProps } from '@lumx/core/js/components/Skeleton';
import { SkeletonTypography } from './SkeletonTypography';

const CLASSNAME = SkeletonTypography.className as string;

describe(`<${SkeletonTypography.displayName}>`, () => {
    const renderSkeletonTypography = (props: SkeletonTypographyProps, options?: SetupRenderOptions) => {
        return render(<SkeletonTypography {...(props as any)} />, options);
    };

    // Run core tests
    BaseSkeletonTypographyTests({ render: renderSkeletonTypography, screen });

    const setup = (props: Partial<SkeletonTypographyProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
        render(<SkeletonTypography {...(props as any)} />, { wrapper });
        const skeletonTypography = queryByClassName(document.body, CLASSNAME);
        return { props, skeletonTypography };
    };

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
