import { render, screen, cleanup } from '@testing-library/vue';
import BasePopoverDialogTests, { setup } from '@lumx/core/js/components/PopoverDialog/Tests';
import { CLASSNAME } from '@lumx/core/js/components/PopoverDialog';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';

import { PopoverDialog } from '.';

// Clean up teleported popover elements between tests
afterEach(() => {
    cleanup();
    // Remove any popovers teleported to body
    document.querySelectorAll(`.${CLASSNAME}`).forEach((el) => el.remove());
});

describe('<PopoverDialog />', () => {
    const renderPopoverDialog = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(PopoverDialog, {
            ...options,
            props: {
                isOpen: true,
                usePortal: false,
                'aria-label': 'Dialog',
                ...props,
            },
            slots: children ? { default: () => children } : { default: () => '<div />' },
        });

    // Run core tests
    BasePopoverDialogTests({
        render: renderPopoverDialog,
        screen,
    });

    const setupPopoverDialog = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderPopoverDialog, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupPopoverDialog, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });
});
