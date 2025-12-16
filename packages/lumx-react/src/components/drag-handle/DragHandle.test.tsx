import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { DragHandle, DragHandleProps } from './DragHandle';

const CLASSNAME = DragHandle.className as string;

type SetupProps = Partial<DragHandleProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: DragHandleProps = { ...propsOverride };

    const { container } = render(<DragHandle {...props} />, { wrapper });
    const handle = queryByClassName(container, CLASSNAME);

    return { props, handle };
};

describe(`<${DragHandle.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'handle',
        forwardAttributes: 'handle',
        forwardRef: 'handle',
        applyTheme: {
            affects: [{ element: 'handle' }],
            viaProp: true,
            viaContext: true,
        },
    });
});
