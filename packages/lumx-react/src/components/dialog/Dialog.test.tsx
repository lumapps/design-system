import { Dialog, DialogProps } from '@lumx/react/components/dialog/Dialog';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import { ThemeSentinel } from '@lumx/react/testing/utils/ThemeSentinel';
import { Heading, HeadingLevelProvider } from '@lumx/react';
import { vi } from 'vitest';
import { DIALOG_TRANSITION_DURATION } from '@lumx/react/constants';
import BaseDialogTests from '@lumx/core/js/components/Dialog/Tests';

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
    // Run core tests
    BaseDialogTests({
        render: (props: DialogProps) => render(<Dialog {...props} />),
        screen,
    });

    describe('Structure', () => {
        it('should render header and footer from props', () => {
            setup({
                header: <div>Header Prop</div>,
                footer: <div>Footer Prop</div>,
            });
            expect(screen.getByText('Header Prop').parentElement).toHaveClass(`${CLASSNAME}__header`);
            expect(screen.getByText('Footer Prop').parentElement).toHaveClass(`${CLASSNAME}__footer`);
        });
    });

    it('should have reset the heading level context', () => {
        setup(
            // Heading inside the dialog
            { children: <Heading>Title</Heading> },
            {
                // This level context should not affect headings inside the dialog
                wrapper({ children }) {
                    return <HeadingLevelProvider level={3}>{children}</HeadingLevelProvider>;
                },
            },
        );
        // Heading inside should use the dialog heading level 2
        expect(screen.queryByRole('heading', { name: 'Title', level: 2 })).toBeInTheDocument();
    });

    describe('Events', () => {
        it('should trigger `onClose` when pressing `escape` key', async () => {
            const onClose = vi.fn();
            setup({ isOpen: true, onClose });

            await userEvent.keyboard('[Escape]');
            expect(onClose).toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing any other key', async () => {
            const onClose = vi.fn();
            setup({ isOpen: true, onClose });

            await userEvent.keyboard('a');
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with `preventAutoClose` set to `true`', async () => {
            const onClose = vi.fn();
            setup({ isOpen: true, onClose, preventAutoClose: true });

            await userEvent.keyboard('[Escape]');
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with `preventCloseOnEscape` set to `true`', async () => {
            const onClose = vi.fn();
            setup({ isOpen: true, onClose, preventCloseOnEscape: true });

            await userEvent.keyboard('[Escape]');
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should trigger `onClose` when clicking outside (overlay)', () => {
            const onClose = vi.fn();
            setup({ isOpen: true, onClose });
            // Click the overlay (which is outside the wrapper)
            // The overlay class is .lumx-dialog__overlay
            const overlay = document.querySelector(`.${CLASSNAME}__overlay`);
            fireEvent.mouseDown(overlay!);
            fireEvent.click(overlay!);
            expect(onClose).toHaveBeenCalled();
        });

        it('should not trigger `onClose` when clicking inside', () => {
            const onClose = vi.fn();
            setup({ isOpen: true, onClose, children: <button type="submit">Inside</button> });
            const insideBtn = screen.getByRole('button', { name: 'Inside' });
            fireEvent.mouseDown(insideBtn);
            fireEvent.click(insideBtn);
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('closeMode', () => {
        it('should unmount dialog when closed (default)', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Dialog isOpen>Content</Dialog>);
            expect(queryByClassName(document.body, CLASSNAME)).toBeInTheDocument();

            rerender(<Dialog isOpen={false}>Content</Dialog>);
            // Still mounted during the close transition
            expect(queryByClassName(document.body, CLASSNAME)).toBeInTheDocument();

            // After the transition duration, the dialog is unmounted
            act(() => vi.advanceTimersByTime(DIALOG_TRANSITION_DURATION));
            expect(queryByClassName(document.body, CLASSNAME)).not.toBeInTheDocument();
            vi.useRealTimers();
        });

        it('should keep dialog mounted when closed with closeMode="hide"', () => {
            const { rerender } = render(
                <Dialog isOpen closeMode="hide">
                    Content
                </Dialog>,
            );
            expect(queryByClassName(document.body, CLASSNAME)).toBeInTheDocument();

            rerender(
                <Dialog isOpen={false} closeMode="hide">
                    Content
                </Dialog>,
            );
            expect(queryByClassName(document.body, CLASSNAME)).toBeInTheDocument();
        });

        it('should add is-hidden class when closed with closeMode="hide"', () => {
            const { rerender } = render(
                <Dialog isOpen closeMode="hide">
                    Content
                </Dialog>,
            );
            expect(queryByClassName(document.body, CLASSNAME)).not.toHaveClass(`${CLASSNAME}--is-hidden`);

            rerender(
                <Dialog isOpen={false} closeMode="hide">
                    Content
                </Dialog>,
            );
            expect(queryByClassName(document.body, CLASSNAME)).toHaveClass(`${CLASSNAME}--is-hidden`);
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
