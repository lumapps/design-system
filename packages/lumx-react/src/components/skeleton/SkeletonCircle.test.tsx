import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { SkeletonCircle, SkeletonCircleProps } from './SkeletonCircle';

const CLASSNAME = SkeletonCircle.className as string;

const setup = (props: Partial<SkeletonCircleProps> = {}) => {
    render(<SkeletonCircle {...(props as any)} />);
    const skeletonCircle = queryByClassName(document.body, CLASSNAME);
    return { props, skeletonCircle };
};

describe(`<${SkeletonCircle.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'skeletonCircle',
        forwardAttributes: 'skeletonCircle',
    });
});
