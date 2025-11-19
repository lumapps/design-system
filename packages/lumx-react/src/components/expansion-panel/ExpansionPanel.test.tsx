import { Mock } from 'vitest';
import React from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByRole, render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { isFocusVisible } from '@lumx/react/utils/browser/isFocusVisible';

import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { ExpansionPanel, ExpansionPanelProps } from '.';

const CLASSNAME = ExpansionPanel.className as string;

vi.mock('@lumx/react/utils/browser/isFocusVisible');

const mockChildrenContent = 'children content';

/** Controlled component that uses a local state to toggle the component */
const ControlledComponent = (props: ExpansionPanelProps) => {
    const [isOpen, handleClose, handleOpen] = useBooleanState(false);

    return (
        <ExpansionPanel isOpen={isOpen} onClose={handleClose} onOpen={handleOpen} {...props}>
            {mockChildrenContent}
        </ExpansionPanel>
    );
};

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (
    propsOverride: Partial<ExpansionPanelProps> = {},
    options: { controlled?: boolean; wrapper?: SetupRenderOptions['wrapper'] } = {},
) => {
    const props = {
        toggleButtonProps: { label: 'Toggle' },
        children: mockChildrenContent,
        ...propsOverride,
    };

    const Component = options.controlled ? ControlledComponent : ExpansionPanel;
    const { container } = render(<Component {...props} />, { wrapper: options.wrapper });

    return {
        container,
        element: getByClassName(container, CLASSNAME),
        query: {
            toggleButton: () => queryByRole(container, 'button', { name: /Toggle/i }),
            header: () => queryByClassName(container, `${CLASSNAME}__header`),
            content: () => screen.queryByText(mockChildrenContent),
        },
        props,
    };
};

describe(`<${ExpansionPanel.displayName}>`, () => {
    (isFocusVisible as Mock).mockReturnValue(false);

    describe('Render', () => {
        it('should render default', () => {
            const { element, query } = setup();
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass(CLASSNAME);
            expect(element).toHaveClass(`${CLASSNAME}--is-close`);
            expect(element).toHaveClass(`${CLASSNAME}--theme-light`);

            // Header is visible
            expect(query.header()).toBeInTheDocument();

            // Content is not visible
            expect(query.content()).not.toBeInTheDocument();

            expect(query.toggleButton()).toHaveAttribute('aria-expanded', 'false');
        });

        it('should render open', () => {
            const { query } = setup({ isOpen: true });

            // Content is visible
            expect(query.content()).toBeInTheDocument();

            expect(query.toggleButton()).toHaveAttribute('aria-expanded', 'true');
        });

        it('should show label', () => {
            const labelText = 'Label text';
            const { query } = setup({ label: labelText });

            expect(query.header()).toHaveTextContent(labelText);
        });

        it('should show header instead of label', () => {
            const labelText = 'Label text';
            const headerText = 'Header text';
            const { query } = setup({ label: labelText, children: <header>{headerText}</header> });

            expect(query.header()).toHaveTextContent(headerText);
        });
    });

    describe('Events', () => {
        const onOpen = vi.fn();
        const onClose = vi.fn();
        const onToggleOpen = vi.fn();

        beforeEach(onOpen.mockClear);
        beforeEach(onClose.mockClear);
        beforeEach(onToggleOpen.mockClear);

        it('should open on click', async () => {
            const { query } = setup({ isOpen: false, onOpen, onClose, onToggleOpen });

            // Content is not visible
            expect(query.content()).not.toBeInTheDocument();

            // Click on toggle button
            await userEvent.click(query.toggleButton() as any);
            expect(onOpen).toHaveBeenCalled();
            expect(onClose).not.toHaveBeenCalled();
            expect(onToggleOpen).toHaveBeenCalledWith(true, expect.anything());
        });

        it('should close on click', async () => {
            const { query } = setup({ isOpen: true, onOpen, onClose, onToggleOpen });

            // Content is visible
            expect(query.content()).toBeInTheDocument();

            // Click on header
            await userEvent.click(query.header() as any);
            expect(onOpen).not.toHaveBeenCalled();
            expect(onClose).toHaveBeenCalled();
            expect(onToggleOpen).toHaveBeenCalledWith(false, expect.anything());
        });

        it('should unmount children after toggling the expansion panel', async () => {
            const user = userEvent.setup();
            const { query } = setup({}, { controlled: true });

            // Content is not mounted by default
            expect(query.content()).not.toBeInTheDocument();

            await user.click(query.header() as any);

            expect(query.content()).toBeInTheDocument();

            await user.click(query.header() as any);

            expect(query.content()).not.toBeInTheDocument();
        });

        it('should hide children after toggling the expansion panel', async () => {
            const user = userEvent.setup();
            const { element, query } = setup({ closeMode: 'hide' }, { controlled: true });

            // Content is hidden (but mounted) by default
            expect(query.content()).toBeInTheDocument();
            expect(element).toHaveClass(`${CLASSNAME}--is-close`);

            await user.click(query.header() as any);

            expect(query.content()).toBeInTheDocument();
            expect(element).toHaveClass(`${CLASSNAME}--is-open`);

            await user.click(query.header() as any);

            expect(query.content()).toBeInTheDocument();
            expect(element).toHaveClass(`${CLASSNAME}--is-close`);
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
        applyTheme: {
            affects: [{ element: 'element' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
