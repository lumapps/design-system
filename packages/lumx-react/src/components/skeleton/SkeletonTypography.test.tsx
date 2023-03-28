import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { SkeletonTypography, SkeletonTypographyProps } from './SkeletonTypography';

const CLASSNAME = SkeletonTypography.className as string;

const setup = (props: Partial<SkeletonTypographyProps> = {}) => {
    render(<SkeletonTypography {...(props as any)} />);
    const skeletonTypography = queryByClassName(document.body, CLASSNAME);
    return { props, skeletonTypography };
};

describe(`<${SkeletonTypography.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'skeletonTypography',
        forwardAttributes: 'skeletonTypography',
    });
});
