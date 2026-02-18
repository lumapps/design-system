import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import BaseProgressCircularTests from '@lumx/core/js/components/ProgressCircular/Tests';

import { ProgressCircular, ProgressCircularProps } from './ProgressCircular';

const CLASSNAME = ProgressCircular.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ProgressCircularProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const { container } = render(<ProgressCircular {...(props as any)} />, { wrapper });
    const element = getByClassName(container, CLASSNAME);
    return { container, element, props };
};

describe(`<${ProgressCircular.displayName}>`, () => {
    // Run core tests
    BaseProgressCircularTests({
        render: (props: ProgressCircularProps) => render(<ProgressCircular {...props} />),
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
