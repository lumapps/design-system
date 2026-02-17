import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import BaseProgressLinearTests from '@lumx/core/js/components/ProgressLinear/Tests';

import { ProgressLinear, ProgressLinearProps } from './ProgressLinear';

const CLASSNAME = ProgressLinear.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ProgressLinearProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const { container } = render(<ProgressLinear {...(props as any)} />, { wrapper });
    const element = getByClassName(container, CLASSNAME);
    return { container, element, props };
};

describe(`<${ProgressLinear.displayName}>`, () => {
    // Run core tests
    BaseProgressLinearTests({
        render: (props: ProgressLinearProps) => render(<ProgressLinear {...props} />),
        screen,
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        applyTheme: {
            affects: [{ element: 'element' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
