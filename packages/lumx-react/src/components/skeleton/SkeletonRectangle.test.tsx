import React from 'react';
import { render, screen } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import BaseSkeletonRectangleTests from '@lumx/core/js/components/Skeleton/SkeletonRectangleTests';
import type { SkeletonRectangleProps } from '@lumx/core/js/components/Skeleton';
import { SkeletonRectangle } from './SkeletonRectangle';

const CLASSNAME = SkeletonRectangle.className as string;

describe(`<${SkeletonRectangle.displayName}>`, () => {
    const renderSkeletonRectangle = (props: SkeletonRectangleProps, options?: SetupRenderOptions) => {
        return render(<SkeletonRectangle {...(props as any)} />, options);
    };

    // Run core tests
    BaseSkeletonRectangleTests({ render: renderSkeletonRectangle, screen });

    const setup = (props: Partial<SkeletonRectangleProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
        render(<SkeletonRectangle {...(props as any)} />, { wrapper });
        const skeletonRectangle = queryByClassName(document.body, CLASSNAME);
        return { props, skeletonRectangle };
    };

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
