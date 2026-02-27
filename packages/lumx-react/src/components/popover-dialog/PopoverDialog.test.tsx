import { render, screen } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import BasePopoverDialogTests from '@lumx/core/js/components/PopoverDialog/Tests';

import { PopoverDialog, PopoverDialogProps } from './PopoverDialog';

const CLASSNAME = PopoverDialog.className as string;

const setupPopoverDialog = (propsOverride: Partial<PopoverDialogProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
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
    // Run core tests
    BasePopoverDialogTests({
        render: (props: any) =>
            render(
                <PopoverDialog anchorRef={{ current: null }} {...props}>
                    <div />
                </PopoverDialog>,
            ),
        screen,
    });

    // Common tests suite
    commonTestsSuiteRTL(setupPopoverDialog, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });
});
