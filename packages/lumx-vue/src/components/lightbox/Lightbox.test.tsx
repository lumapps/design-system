import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { nextTick } from 'vue';

import BaseLightboxTests, { setup } from '@lumx/core/js/components/Lightbox/Tests';
import { DialogLabelRegistryTests } from '@lumx/core/js/components/Dialog/labelRegistryTests';
import { CLASSNAME } from '@lumx/core/js/components/Lightbox';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';
import { DialogHeading } from '@lumx/vue/components/dialog';

import { Lightbox } from '.';

// Clean up teleported lightbox elements between tests
afterEach(() => {
    cleanup();
    document.querySelectorAll(`.${CLASSNAME}`).forEach((el) => el.remove());
});

describe('<Lightbox />', () => {
    const renderLightbox = ({ children, parentElement, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(Lightbox, {
            ...options,
            props: {
                isOpen: true,
                // Tests.ts passes parentElement as a React ref { current: HTMLElement }; Vue expects a plain HTMLElement
                parentElement: parentElement?.current ?? parentElement ?? document.createElement('div'),
                ...props,
            },
            slots: children ? { default: () => children } : undefined,
        });

    // Core shared tests
    BaseLightboxTests({ render: renderLightbox, screen });

    // Core shared tests: DialogHeading registry wiring.
    DialogLabelRegistryTests({
        render: renderLightbox,
        makeDialogHeading: (name: string) => <DialogHeading>{name}</DialogHeading>,
        screen,
    });

    const setupLightbox = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderLightbox, screen });

    describe('Vue', () => {
        describe('Events', () => {
            it('should emit close on Escape key press', async () => {
                const { emitted } = render(Lightbox, {
                    props: { isOpen: true, parentElement: document.createElement('div') },
                });
                await userEvent.keyboard('[Escape]');
                expect(emitted('close')).toBeTruthy();
            });

            it('should not emit close on Escape when preventAutoClose is true', async () => {
                const { emitted } = render(Lightbox, {
                    props: { isOpen: true, parentElement: document.createElement('div'), preventAutoClose: true },
                });
                await userEvent.keyboard('[Escape]');
                expect(emitted('close')).toBeFalsy();
            });

            it('should emit close when clicking outside the lightbox', () => {
                const { emitted } = render(Lightbox, {
                    props: { isOpen: true, parentElement: document.createElement('div') },
                });
                fireEvent.mouseDown(document.body);
                expect(emitted('close')).toBeTruthy();
            });
        });

        // Registry link/absent cases are covered by the shared DialogLabelRegistryTests above; mechanics
        // (last-wins, fallback, unmount) by the IdsRegistry tests. Here we only assert Lightbox's own
        // top-level aria props take precedence over the registry.
        describe('Label registry', () => {
            it('should let an explicit aria-label prop override the registry', async () => {
                render(Lightbox, {
                    props: {
                        isOpen: true,
                        parentElement: document.createElement('div'),
                        'aria-label': 'Explicit label',
                    } as any,
                    slots: { default: () => <DialogHeading>My lightbox</DialogHeading> },
                });
                await nextTick();
                const dialog = screen.getByRole('dialog');
                expect(dialog).toHaveAttribute('aria-label', 'Explicit label');
                expect(dialog).not.toHaveAttribute('aria-labelledby');
            });
        });
    });

    commonTestsSuiteVTL(setupLightbox, {
        baseClassName: CLASSNAME,
        forwardClassName: 'lightbox',
        forwardAttributes: 'lightbox',
        forwardRef: 'lightbox',
    });
});
