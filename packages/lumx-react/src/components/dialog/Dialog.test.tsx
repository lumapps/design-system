import { Dialog, DialogProps } from '@lumx/react/components/dialog/Dialog';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import { ThemeSentinel } from '@lumx/react/testing/utils/ThemeSentinel';
import { Button, Heading, HeadingLevelProvider, Tooltip } from '@lumx/react';
import { classNames } from '@lumx/core/js/utils';
import { vi } from 'vitest';
import { DIALOG_TRANSITION_DURATION } from '@lumx/react/constants';
import BaseDialogTests from '@lumx/core/js/components/Dialog/Tests';
import { DialogLabelRegistryTests } from '@lumx/core/js/components/Dialog/labelRegistryTests';
import { DialogHeading } from '@lumx/react/components/dialog';

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

    // Core shared tests: DialogHeading registry wiring.
    DialogLabelRegistryTests({
        render: ({ children, ...props }: any) =>
            render(
                <Dialog isOpen {...props}>
                    {children}
                </Dialog>,
            ),
        makeDialogHeading: (name: string) => <DialogHeading>{name}</DialogHeading>,
        screen,
    });

    // Registry link/absent cases are covered by the shared DialogLabelRegistryTests above; mechanics
    // (last-wins, fallback) by the IdsRegistry tests. Here we assert Dialog's own accessible-name resolution:
    // the consumer id, unmount clearing, and explicit dialogProps overrides.
    describe('Label registry', () => {
        it('should remove aria-labelledby when the DialogHeading is unmounted', () => {
            const { rerender } = render(
                <Dialog isOpen dialogProps={{ 'data-testid': 'dialog' }}>
                    <header>
                        <DialogHeading>My dialog</DialogHeading>
                    </header>
                </Dialog>,
            );
            const dialog = screen.getByTestId('dialog');
            expect(dialog).toHaveAttribute('aria-labelledby');

            rerender(<Dialog isOpen dialogProps={{ 'data-testid': 'dialog' }} />);
            expect(dialog).not.toHaveAttribute('aria-labelledby');
        });

        it('should use the consumer id for the link', () => {
            render(
                <Dialog isOpen dialogProps={{ 'data-testid': 'dialog' }}>
                    <header>
                        <DialogHeading id="my-heading-id">My dialog</DialogHeading>
                    </header>
                </Dialog>,
            );
            expect(screen.getByTestId('dialog')).toHaveAttribute('aria-labelledby', 'my-heading-id');
        });

        it('should let an explicit aria-labelledby (via dialogProps) override the registry', () => {
            render(
                <Dialog isOpen dialogProps={{ 'data-testid': 'dialog', 'aria-labelledby': 'explicit-id' }}>
                    <header>
                        <DialogHeading>My dialog</DialogHeading>
                    </header>
                </Dialog>,
            );
            expect(screen.getByTestId('dialog')).toHaveAttribute('aria-labelledby', 'explicit-id');
        });

        it('should only render one of aria-label/aria-labelledby when dialogProps sets both', () => {
            render(
                <Dialog
                    isOpen
                    dialogProps={{
                        'data-testid': 'dialog',
                        'aria-label': 'Explicit label',
                        'aria-labelledby': 'explicit-id',
                    }}
                >
                    <header>
                        <DialogHeading>My dialog</DialogHeading>
                    </header>
                </Dialog>,
            );
            const dialog = screen.getByTestId('dialog');
            expect(dialog).toHaveAttribute('aria-label', 'Explicit label');
            expect(dialog).not.toHaveAttribute('aria-labelledby');
        });
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

    describe('Non-modal (`aria-modal` false)', () => {
        const setupNonModal = (props: Partial<DialogProps> = {}) => {
            render(
                <>
                    <button type="button">Outside</button>
                    <Dialog isOpen dialogProps={{ 'aria-modal': false }} {...props}>
                        {props.children || <button type="button">Inside</button>}
                    </Dialog>
                </>,
            );
        };

        it('should move the focus into the dialog on open', () => {
            setupNonModal();
            expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
        });

        it('should not trap the focus', async () => {
            setupNonModal();
            await userEvent.tab();
            expect(screen.getByRole('button', { name: 'Inside' })).not.toHaveFocus();
        });

        it('should trigger `onClose` when pressing `escape` key with the focus inside', async () => {
            const onClose = vi.fn();
            setupNonModal({ onClose });
            await userEvent.keyboard('[Escape]');
            expect(onClose).toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with the focus outside', async () => {
            const onClose = vi.fn();
            setupNonModal({ onClose });
            screen.getByRole('button', { name: 'Outside' }).focus();
            await userEvent.keyboard('[Escape]');
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when clicking outside', async () => {
            const onClose = vi.fn();
            setupNonModal({ onClose });
            await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not disable the body scroll', () => {
            // Modal dialog: the body scroll is disabled.
            const { unmount } = render(<Dialog isOpen />);
            expect(document.body.style.overflow).toBe('hidden');
            unmount();

            setupNonModal();
            expect(document.body.style.overflow).not.toBe('hidden');
        });

        it('should close a tooltip inside on the first `escape` and the dialog on the second', async () => {
            const onClose = vi.fn();
            setupNonModal({
                onClose,
                children: (
                    <Tooltip label="Tooltip label" closeMode="hide">
                        <Button>Anchor</Button>
                    </Tooltip>
                ),
            });
            const tooltip = screen.getByRole('tooltip', { hidden: true });
            await userEvent.hover(screen.getByRole('button', { name: 'Anchor' }));
            expect(tooltip).not.toHaveClass(classNames.visuallyHidden());

            await userEvent.keyboard('[Escape]');
            expect(tooltip).toHaveClass(classNames.visuallyHidden());
            expect(onClose).not.toHaveBeenCalled();

            await userEvent.keyboard('[Escape]');
            expect(onClose).toHaveBeenCalledTimes(1);
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
