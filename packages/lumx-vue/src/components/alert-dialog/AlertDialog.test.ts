import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import { vi } from 'vitest';
import BaseAlertDialogTests, { setup } from '@lumx/core/js/components/AlertDialog/Tests';
import { CLASSNAME } from '@lumx/core/js/components/AlertDialog';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';

import { AlertDialog } from '.';

// Clean up teleported dialog elements between tests
afterEach(() => {
    cleanup();
    document.querySelectorAll(`.${CLASSNAME}`).forEach((el) => el.remove());
});

describe('<AlertDialog />', () => {
    const renderAlertDialog = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(AlertDialog, {
            ...options,
            props: {
                isOpen: true,
                confirmProps: { label: 'OK', onClick: () => {} },
                ...props,
            },
            slots: children ? { default: () => children } : {},
        });

    // Run core tests
    BaseAlertDialogTests({ render: renderAlertDialog, screen });

    const setupAlertDialog = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderAlertDialog, screen });

    // Vue-specific tests
    describe('Vue', () => {
        it('emits close when the dialog requests close', () => {
            const { emitted } = render(AlertDialog, {
                props: { isOpen: true, confirmProps: { label: 'OK', onClick: vi.fn() } },
            });
            const overlay = document.querySelector('.lumx-dialog__overlay');
            fireEvent.mouseDown(overlay!);
            fireEvent.click(overlay!);
            expect(emitted('close')).toBeTruthy();
        });

        it('should set v-model:is-open to false when the dialog requests close', async () => {
            render({
                template:
                    '<div><AlertDialog v-model:is-open="isOpen" :confirm-props="confirmProps" /><span data-testid="out">{{ isOpen }}</span></div>',
                components: { AlertDialog },
                data() {
                    return { isOpen: true, confirmProps: { label: 'OK', onClick: () => {} } };
                },
            });
            const overlay = document.querySelector('.lumx-dialog__overlay');
            await fireEvent.mouseDown(overlay!);
            await fireEvent.click(overlay!);

            expect(screen.getByTestId('out')).toHaveTextContent('false');
        });
    });

    commonTestsSuiteVTL(setupAlertDialog, {
        baseClassName: CLASSNAME,
        forwardClassName: 'alertDialog',
        forwardAttributes: 'alertDialog',
    });
});
