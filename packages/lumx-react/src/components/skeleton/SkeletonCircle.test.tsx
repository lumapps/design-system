import { render, screen } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import BaseSkeletonCircleTests from '@lumx/core/js/components/Skeleton/SkeletonCircleTests';
import type { SkeletonCircleProps } from '@lumx/core/js/components/Skeleton';
import { SkeletonCircle } from './SkeletonCircle';

const CLASSNAME = SkeletonCircle.className as string;

describe(`<${SkeletonCircle.displayName}>`, () => {
    const renderSkeletonCircle = (props: SkeletonCircleProps, options?: SetupRenderOptions) => {
        return render(<SkeletonCircle {...(props as any)} />, options);
    };

    // Run core tests
    BaseSkeletonCircleTests({ render: renderSkeletonCircle, screen });

    const setup = (props: Partial<SkeletonCircleProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
        render(<SkeletonCircle {...(props as any)} />, { wrapper });
        const skeletonCircle = queryByClassName(document.body, CLASSNAME);
        return { props, skeletonCircle };
    };

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
