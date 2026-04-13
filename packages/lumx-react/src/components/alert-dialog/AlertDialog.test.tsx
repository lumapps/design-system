import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BaseAlertDialogTests from '@lumx/core/js/components/AlertDialog/Tests';
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
    // Run core tests
    BaseAlertDialogTests({
        render: (props: any) => render(<AlertDialog {...props} />),
        screen,
    });

    // React-specific tests
    describe('React', () => {
        it('renders children as a div when node', () => {
            setup({ children: <span>Node content</span> });
            const content = screen.getByText('Node content');
            expect(content.parentElement?.tagName).toBe('DIV');
        });

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
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'alertDialog',
        forwardAttributes: 'alertDialog',
    });
});
