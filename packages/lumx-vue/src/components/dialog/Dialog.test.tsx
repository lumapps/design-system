import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, nextTick, ref } from 'vue';
import { vi } from 'vitest';
import BaseDialogTests, { setup } from '@lumx/core/js/components/Dialog/Tests';
import { DialogLabelRegistryTests } from '@lumx/core/js/components/Dialog/labelRegistryTests';
import { CLASSNAME } from '@lumx/core/js/components/Dialog';
import { DIALOG_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';
import { queryByClassName } from '@lumx/core/testing/queries';

import { Dialog, DialogHeading } from '.';

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

    // Core shared tests: DialogHeading registry wiring.
    DialogLabelRegistryTests({
        render: renderDialog,
        makeDialogHeading: (name: string) => <DialogHeading>{name}</DialogHeading>,
        screen,
    });

    const setupDialog = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderDialog, screen });

    // Registry link/absent cases are covered by the shared DialogLabelRegistryTests above; mechanics
    // (last-wins, fallback) by the IdsRegistry tests. Here we assert Dialog's own accessible-name resolution:
    // the consumer id, unmount clearing, and explicit dialogProps overrides.
    describe('Label registry', () => {
        it('should remove aria-labelledby when the DialogHeading is unmounted', async () => {
            const showHeading = ref(true);
            const Wrapper = defineComponent({
                setup() {
                    return () => (
                        <Dialog isOpen dialogProps={{ 'data-testid': 'dialog' }}>
                            {{ header: () => (showHeading.value ? <DialogHeading>My dialog</DialogHeading> : null) }}
                        </Dialog>
                    );
                },
            });
            render(Wrapper);
            await nextTick();
            const dialog = screen.getByTestId('dialog');
            expect(dialog).toHaveAttribute('aria-labelledby');

            showHeading.value = false;
            await nextTick();
            expect(dialog).not.toHaveAttribute('aria-labelledby');
        });

        it('should use the consumer id for the link', async () => {
            render(Dialog, {
                props: { isOpen: true, dialogProps: { 'data-testid': 'dialog' } },
                slots: {
                    header: () => <DialogHeading id="my-heading-id">My dialog</DialogHeading>,
                },
            });
            await nextTick();
            expect(screen.getByTestId('dialog')).toHaveAttribute('aria-labelledby', 'my-heading-id');
        });

        it('should let an explicit aria-labelledby (via dialogProps) override the registry', async () => {
            render(Dialog, {
                props: {
                    isOpen: true,
                    dialogProps: { 'data-testid': 'dialog', 'aria-labelledby': 'explicit-id' },
                },
                slots: {
                    header: () => <DialogHeading>My dialog</DialogHeading>,
                },
            });
            await nextTick();
            expect(screen.getByTestId('dialog')).toHaveAttribute('aria-labelledby', 'explicit-id');
        });

        it('should only render one of aria-label/aria-labelledby when dialogProps sets both', async () => {
            render(Dialog, {
                props: {
                    isOpen: true,
                    dialogProps: {
                        'data-testid': 'dialog',
                        'aria-label': 'Explicit label',
                        'aria-labelledby': 'explicit-id',
                    },
                },
                slots: {
                    header: () => <DialogHeading>My dialog</DialogHeading>,
                },
            });
            await nextTick();
            const dialog = screen.getByTestId('dialog');
            expect(dialog).toHaveAttribute('aria-label', 'Explicit label');
            expect(dialog).not.toHaveAttribute('aria-labelledby');
        });
    });

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

        describe('inline header/footer children', () => {
            it('should forward the inline header/footer own class to the rendered elements', () => {
                render(Dialog, {
                    props: { isOpen: true, disableBodyScroll: false },
                    slots: {
                        default: () => [
                            <header class="my-header">Header content</header>,
                            <footer class="my-footer">Footer content</footer>,
                        ],
                    },
                });

                const header = queryByClassName(document.body, `${CLASSNAME}__header`);
                expect(header).toHaveClass('my-header');
                expect(header).toHaveTextContent('Header content');

                const footer = queryByClassName(document.body, `${CLASSNAME}__footer`);
                expect(footer).toHaveClass('my-footer');
                expect(footer).toHaveTextContent('Footer content');
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
