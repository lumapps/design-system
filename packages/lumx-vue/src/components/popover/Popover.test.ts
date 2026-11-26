import { render, screen, cleanup } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
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

    describe('Vue', () => {
        it('should set v-model:is-open to false on Escape key press', async () => {
            render({
                template:
                    '<div><Popover v-model:is-open="isOpen" :close-on-escape="true" :use-portal="false">Popover content</Popover><span data-testid="out">{{ isOpen }}</span></div>',
                components: { Popover },
                data() {
                    return { isOpen: true };
                },
            });
            await userEvent.keyboard('{Escape}');
            expect(screen.getByTestId('out')).toHaveTextContent('false');
        });
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
