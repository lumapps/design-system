import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import BaseLightboxTests, { setup } from '@lumx/core/js/components/Lightbox/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Lightbox';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';

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
    });

    commonTestsSuiteVTL(setupLightbox, {
        baseClassName: CLASSNAME,
        forwardClassName: 'lightbox',
        forwardAttributes: 'lightbox',
        forwardRef: 'lightbox',
    });
});
