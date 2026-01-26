import { Dialog, DialogProps } from '@lumx/react/components/dialog/Dialog';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen, fireEvent } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import { ThemeSentinel } from '@lumx/react/testing/utils/ThemeSentinel';
import { Heading, HeadingLevelProvider } from '@lumx/react';
import { vi } from 'vitest';

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

    describe('Loading', () => {
        it('should render progress indicator when isLoading is true', () => {
            setup({ isLoading: true });
            const progress = document.querySelector('.lumx-progress');
            expect(progress).toBeInTheDocument();
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
