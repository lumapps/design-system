import { render, screen, cleanup } from '@testing-library/vue';
import BasePopoverTests, { setup } from '@lumx/core/js/components/Popover/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Popover';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';

import { Popover } from '.';

// Clean up teleported popover elements between tests
afterEach(() => {
    cleanup();
    // Remove any popovers teleported to body
    document.querySelectorAll(`.${CLASSNAME}`).forEach((el) => el.remove());
});

describe('<Popover />', () => {
    const renderPopover = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(Popover, {
            ...options,
            props: {
                ...props,
                usePortal: props.usePortal ?? false,
            },
            slots: { default: () => children || 'Popover content' },
        });

    // Run core tests (shared between React and Vue)
    BasePopoverTests({
        render: renderPopover,
        screen,
    });

    const setupPopover = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderPopover, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupPopover, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        applyTheme: {
            affects: [{ element: 'element' }],
            viaProp: true,
            viaContext: false,
        },
    });
});
