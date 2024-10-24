import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { queryByRole, render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { isFocusVisible } from '@lumx/react/utils/isFocusVisible';

import { ExpansionPanel, ExpansionPanelProps } from '.';

const CLASSNAME = ExpansionPanel.className as string;

jest.mock('@lumx/react/utils/isFocusVisible');

const mockChildrenContent = 'children content';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<ExpansionPanelProps> = {}) => {
    const props = {
        toggleButtonProps: { label: 'Toggle' },
        children: mockChildrenContent,
        ...propsOverride,
    };
    const { container } = render(<ExpansionPanel {...props} />);

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
    (isFocusVisible as jest.Mock).mockReturnValue(false);

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
        const onOpen = jest.fn();
        const onClose = jest.fn();
        const onToggleOpen = jest.fn();

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
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });
});
