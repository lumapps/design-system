import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import BaseDialogTests, { setup } from '@lumx/core/js/components/Dialog/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Dialog';
import { DIALOG_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';
import { queryByClassName } from '@lumx/core/testing/queries';

import { Dialog } from '.';

// Clean up teleported dialog elements between tests
afterEach(() => {
    cleanup();
    document.querySelectorAll(`.${CLASSNAME}`).forEach((el) => el.remove());
});

describe('<Dialog />', () => {
    const renderDialog = ({ children, header, footer, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(Dialog, {
            ...options,
            props: {
                isOpen: true,
                disableBodyScroll: false,
                ...props,
            },
            slots: {
                ...(children ? { default: () => children } : {}),
                ...(header ? { header: () => header } : {}),
                ...(footer ? { footer: () => footer } : {}),
            },
        });

    // Core shared tests
    BaseDialogTests({ render: renderDialog, screen });

    const setupDialog = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderDialog, screen });

    describe('Vue', () => {
        describe('Events', () => {
            it('should emit close on Escape key press', async () => {
                const { emitted } = render(Dialog, { props: { isOpen: true, disableBodyScroll: false } });
                await userEvent.keyboard('[Escape]');
                expect(emitted('close')).toBeTruthy();
            });

            it('should not emit close on Escape when preventAutoClose is true', async () => {
                const { emitted } = render(Dialog, {
                    props: { isOpen: true, disableBodyScroll: false, preventAutoClose: true },
                });
                await userEvent.keyboard('[Escape]');
                expect(emitted('close')).toBeFalsy();
            });

            it('should not emit close on Escape when preventCloseOnEscape is true', async () => {
                const { emitted } = render(Dialog, {
                    props: { isOpen: true, disableBodyScroll: false, preventCloseOnEscape: true },
                });
                await userEvent.keyboard('[Escape]');
                expect(emitted('close')).toBeFalsy();
            });

            it('should emit close when clicking outside (overlay)', () => {
                const { emitted } = render(Dialog, { props: { isOpen: true, disableBodyScroll: false } });
                const overlay = document.querySelector(`.${CLASSNAME}__overlay`);
                fireEvent.mouseDown(overlay!);
                fireEvent.click(overlay!);
                expect(emitted('close')).toBeTruthy();
            });

            it('should not emit close when clicking inside the dialog', () => {
                const { emitted } = render(Dialog, {
                    props: { isOpen: true, disableBodyScroll: false },
                });
                const content = document.querySelector(`.${CLASSNAME}__content`);
                fireEvent.mouseDown(content!);
                fireEvent.click(content!);
                expect(emitted('close')).toBeFalsy();
            });
        });

        describe('closeMode', () => {
            it('should unmount dialog when closed (default)', async () => {
                vi.useFakeTimers();
                const { rerender } = render(Dialog, { props: { isOpen: true, disableBodyScroll: false } });
                expect(queryByClassName(document.body, CLASSNAME)).toBeInTheDocument();

                await rerender({ isOpen: false, disableBodyScroll: false });
                // Still mounted during close transition
                expect(queryByClassName(document.body, CLASSNAME)).toBeInTheDocument();

                vi.advanceTimersByTime(DIALOG_TRANSITION_DURATION);
                await nextTick();
                expect(queryByClassName(document.body, CLASSNAME)).not.toBeInTheDocument();
                vi.useRealTimers();
            });

            it('should keep dialog mounted with closeMode="hide"', async () => {
                const { rerender } = render(Dialog, {
                    props: { isOpen: true, disableBodyScroll: false, closeMode: 'hide' },
                });
                await rerender({ isOpen: false, disableBodyScroll: false, closeMode: 'hide' });
                expect(queryByClassName(document.body, CLASSNAME)).toBeInTheDocument();
            });

            it('should add is-hidden class when closed with closeMode="hide"', async () => {
                const { rerender } = render(Dialog, {
                    props: { isOpen: true, disableBodyScroll: false, closeMode: 'hide' },
                });
                expect(queryByClassName(document.body, CLASSNAME)).not.toHaveClass(`${CLASSNAME}--is-hidden`);

                await rerender({ isOpen: false, disableBodyScroll: false, closeMode: 'hide' });
                expect(queryByClassName(document.body, CLASSNAME)).toHaveClass(`${CLASSNAME}--is-hidden`);
            });
        });
    });

    commonTestsSuiteVTL(setupDialog, {
        baseClassName: CLASSNAME,
        forwardAttributes: 'dialog',
        forwardRef: 'dialog',
        forwardClassName: 'dialog',
    });
});
