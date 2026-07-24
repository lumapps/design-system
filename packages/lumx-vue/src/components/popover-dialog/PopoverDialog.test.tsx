import { render, screen, cleanup } from '@testing-library/vue';
import { nextTick } from 'vue';
import BasePopoverDialogTests, { setup } from '@lumx/core/js/components/PopoverDialog/Tests';
import { DialogLabelRegistryTests } from '@lumx/core/js/components/Dialog/labelRegistryTests';
import { CLASSNAME } from '@lumx/core/js/components/PopoverDialog';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';
import { DialogHeading } from '@lumx/vue/components/dialog';

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

    // Core shared tests: DialogHeading registry wiring.
    DialogLabelRegistryTests({
        render: renderPopoverDialog,
        makeDialogHeading: (name: string) => <DialogHeading>{name}</DialogHeading>,
        screen,
    });

    // Registry link/absent cases are covered by the shared DialogLabelRegistryTests above; mechanics
    // (last-wins, fallback, unmount) by the IdsRegistry tests. Here we assert PopoverDialog's own `label` prop
    // takes precedence, and — Vue-specific — that raw React-named aria props don't leak through as stray attributes.
    describe('Label registry', () => {
        it('should let an explicit aria-labelledby override the registry', async () => {
            renderPopoverDialog({
                'aria-label': undefined,
                'aria-labelledby': 'explicit-id',
                children: <DialogHeading>My popover</DialogHeading>,
            });
            await nextTick();
            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('aria-labelledby', 'explicit-id');
            // The raw (un-resolved) prop must not leak through as a stray attribute alongside the resolved one.
            expect(dialog).not.toHaveAttribute('arialabelledby');
        });

        it('should let the label prop override the registry', async () => {
            renderPopoverDialog({
                'aria-label': undefined,
                label: 'Label prop',
                children: <DialogHeading>My popover</DialogHeading>,
            });
            await nextTick();
            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('aria-label', 'Label prop');
            expect(dialog).not.toHaveAttribute('aria-labelledby');
            // The raw (un-resolved) prop must not leak through as a stray attribute alongside the resolved one.
            expect(dialog).not.toHaveAttribute('arialabel');
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupPopoverDialog, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });
});
