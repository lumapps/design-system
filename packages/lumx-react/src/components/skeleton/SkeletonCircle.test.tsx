import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { SkeletonCircle, SkeletonCircleProps } from './SkeletonCircle';

const CLASSNAME = SkeletonCircle.className as string;

const setup = (props: Partial<SkeletonCircleProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<SkeletonCircle {...(props as any)} />, { wrapper });
    const skeletonCircle = queryByClassName(document.body, CLASSNAME);
    return { props, skeletonCircle };
};

describe(`<${SkeletonCircle.displayName}>`, () => {
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
