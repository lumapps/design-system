import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { SkeletonRectangle, SkeletonRectangleProps } from './SkeletonRectangle';

const CLASSNAME = SkeletonRectangle.className as string;

const setup = (props: Partial<SkeletonRectangleProps> = {}) => {
    render(<SkeletonRectangle {...(props as any)} />);
    const skeletonRectangle = queryByClassName(document.body, CLASSNAME);
    return { props, skeletonRectangle };
};

describe(`<${SkeletonRectangle.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'skeletonRectangle',
        forwardAttributes: 'skeletonRectangle',
    });
});
