import { render, screen } from '@testing-library/react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { DialogHeadingTests } from '@lumx/core/js/components/Dialog/DialogHeadingTests';

import { DialogHeading, DialogHeadingProps } from './DialogHeading';

const CLASSNAME = 'lumx-heading';

const setup = (props: Partial<DialogHeadingProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const { container } = render(<DialogHeading {...props}>{props.children ?? 'Title'}</DialogHeading>, { wrapper });
    return { props, container, dialogHeading: getByClassName(container, CLASSNAME) };
};

describe(`<${DialogHeading.displayName}>`, () => {
    // Core shared tests: standalone render (id generation, heading role).
    DialogHeadingTests({
        render: ({ children, ...props }: any) => render(<DialogHeading {...props}>{children}</DialogHeading>),
        screen,
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'dialogHeading',
        forwardAttributes: 'dialogHeading',
        forwardRef: 'dialogHeading',
    });
});
