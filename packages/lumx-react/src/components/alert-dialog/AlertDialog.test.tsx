import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Kind } from '@lumx/react';
import { AlertDialog, AlertDialogProps } from './AlertDialog';

vi.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));

const CLASSNAME = AlertDialog.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<AlertDialogProps> = {}) => {
    const props: AlertDialogProps = {
        title: 'Alert',
        isOpen: true,
        description: 'Deserunt et sunt qui consequat sint sit.',
        confirmProps: { onClick: vi.fn(), label: 'OK' },
        ...propsOverride,
    };
    render(<AlertDialog {...props} />);
    const alertDialog = queryByClassName(document.body, CLASSNAME);
    return { alertDialog, props };
};

describe(`<${AlertDialog.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'alertDialog',
        forwardAttributes: 'alertDialog',
    });

    describe('Accessibility', () => {
        it('has the correct role and aria attributes', () => {
            setup({ children: 'Content' });
            const dialog = screen.getByRole('alertdialog');
            expect(dialog).toBeInTheDocument();

            const titleId = dialog.getAttribute('aria-labelledby');
            const descId = dialog.getAttribute('aria-describedby');

            expect(titleId).toBe(':r1:-title');
            expect(descId).toBe(':r1:-description');

            expect(document.getElementById(titleId!)?.textContent).toBe('Alert');
            expect(document.getElementById(descId!)?.textContent).toBe('Content');
        });
    });

    describe('Content Rendering', () => {
        it('renders the title', () => {
            setup({ title: 'Custom Title' });
            expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Custom Title');
        });

        it('renders children as a paragraph when string', () => {
            setup({ children: 'String content' });
            const content = screen.getByText('String content');
            expect(content.tagName).toBe('P');
        });

        it('renders children as a div when node', () => {
            setup({ children: <span>Node content</span> });
            const content = screen.getByText('Node content');
            expect(content.parentElement?.tagName).toBe('DIV');
        });
    });

    describe('Buttons', () => {
        it('renders confirm button and handles click', () => {
            const onClick = vi.fn();
            setup({ confirmProps: { label: 'Confirm Me', onClick } });

            const btn = screen.getByRole('button', { name: 'Confirm Me' });
            fireEvent.click(btn);
            expect(onClick).toHaveBeenCalled();
        });

        it('renders cancel button when props provided and handles click', () => {
            const onClick = vi.fn();
            setup({ cancelProps: { label: 'Cancel Me', onClick } });

            const btn = screen.getByRole('button', { name: 'Cancel Me' });
            fireEvent.click(btn);
            expect(onClick).toHaveBeenCalled();
        });

        it('does not render cancel button when props not provided', () => {
            setup({ cancelProps: undefined });
            expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
        });
    });

    describe('Variants', () => {
        it('applies correct color to confirm button based on kind (error)', () => {
            setup({ kind: Kind.error, confirmProps: { label: 'Confirm', onClick: vi.fn() } });
            const btn = screen.getByRole('button', { name: 'Confirm' });
            expect(btn.className).toContain('lumx-button--color-red');
        });

        it('applies correct color to confirm button based on kind (success)', () => {
            setup({ kind: Kind.success, confirmProps: { label: 'Confirm', onClick: vi.fn() } });
            const btn = screen.getByRole('button', { name: 'Confirm' });
            expect(btn.className).toContain('lumx-button--color-green');
        });
    });
});
