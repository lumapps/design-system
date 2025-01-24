import React from 'react';

import { Dialog, DialogProps } from '@lumx/react/components/dialog/Dialog';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import { ThemeSentinel } from '@lumx/react/testing/utils/ThemeSentinel';

const CLASSNAME = Dialog.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<DialogProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(
        <Dialog isOpen {...props}>
            {props.children || <ThemeSentinel />}
        </Dialog>,
        { wrapper },
    );
    const dialog = queryByClassName(document.body, CLASSNAME);
    const container = dialog && queryByClassName(dialog, `${CLASSNAME}__container`);
    const themeSentinel = screen.queryByTestId(ThemeSentinel.testId);
    return { props, dialog, container, themeSentinel };
};

describe(`<${Dialog.displayName}>`, () => {
    it('should render default', () => {
        const { dialog, container } = setup();
        expect(dialog).toBeInTheDocument();
        expect(container).toBe(screen.queryByRole('dialog'));
        expect(container).toHaveAttribute('aria-modal', 'true');
    });

    describe('Events', () => {
        it('should trigger `onClose` when pressing `escape` key', async () => {
            const onClose = jest.fn();
            setup({ isOpen: true, onClose });

            await userEvent.keyboard('[Escape]');
            expect(onClose).toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing any other key', async () => {
            const onClose = jest.fn();
            setup({ isOpen: true, onClose });

            await userEvent.keyboard('a');
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with `preventAutoClose` set to `true`', async () => {
            const onClose = jest.fn();
            setup({ isOpen: true, onClose, preventAutoClose: true });

            await userEvent.keyboard('[Escape]');
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with `preventCloseOnEscape` set to `true`', async () => {
            const onClose = jest.fn();
            setup({ isOpen: true, onClose, preventCloseOnEscape: true });

            await userEvent.keyboard('[Escape]');
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardAttributes: 'dialog',
        forwardRef: 'dialog',
        forwardClassName: 'dialog',
        applyTheme: {
            // Theme should not affect the children components
            affects: [{ not: { element: 'themeSentinel' } }],
            viaProp: true,
            viaContext: true,
        },
    });
});
