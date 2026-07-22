import { render, screen } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import BasePopoverDialogTests from '@lumx/core/js/components/PopoverDialog/Tests';
import { DialogLabelRegistryTests } from '@lumx/core/js/components/Dialog/labelRegistryTests';
import { DialogHeading } from '@lumx/react/components/dialog';

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

    // Core shared tests: DialogHeading registry wiring.
    DialogLabelRegistryTests({
        render: ({ children, ...props }: any) =>
            render(
                <PopoverDialog isOpen anchorRef={{ current: null }} usePortal={false} {...props}>
                    {children}
                </PopoverDialog>,
            ),
        makeDialogHeading: (name: string) => <DialogHeading>{name}</DialogHeading>,
        screen,
    });

    // Registry link/absent cases are covered by the shared DialogLabelRegistryTests above; mechanics
    // (last-wins, fallback, unmount, aria-* overrides) by the IdsRegistry tests and DialogHeading.test. Here
    // we only assert PopoverDialog's own `label` prop takes precedence over the registry.
    describe('Label registry', () => {
        it('should let the label prop override the registry', () => {
            const { element } = setupPopoverDialog({
                'aria-label': undefined,
                label: 'Label prop',
                children: <DialogHeading>My popover</DialogHeading>,
            } as any);
            expect(element).toHaveAttribute('aria-label', 'Label prop');
            expect(element).not.toHaveAttribute('aria-labelledby');
        });
    });

    // Common tests suite
    commonTestsSuiteRTL(setupPopoverDialog, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });
});
