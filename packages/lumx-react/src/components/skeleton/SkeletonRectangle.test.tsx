import React from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { SkeletonRectangle, SkeletonRectangleProps } from './SkeletonRectangle';

const CLASSNAME = SkeletonRectangle.className as string;

const setup = (props: Partial<SkeletonRectangleProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<SkeletonRectangle {...(props as any)} />, { wrapper });
    const skeletonRectangle = queryByClassName(document.body, CLASSNAME);
    return { props, skeletonRectangle };
};

describe(`<${SkeletonRectangle.displayName}>`, () => {
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
