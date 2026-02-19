import { render } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { PopoverDialog, PopoverDialogProps } from './PopoverDialog';

const CLASSNAME = PopoverDialog.className as string;

const setup = (propsOverride: Partial<PopoverDialogProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props = { children: <div />, ...propsOverride };
    const { container } = render(
        <PopoverDialog
            isOpen
            anchorRef={{ current: null }}
            usePortal={false}
            aria-label="Dialog"
            {...(props as any)}
        />,
        { wrapper },
    );
    const element = getByClassName(container, CLASSNAME);
    return { props, container, element };
};

describe(`<${PopoverDialog.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });
});
