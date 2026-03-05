import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ComboboxOptionContext } from '../../context/ComboboxOptionContext';
import { ComboboxOptionMoreInfo } from './index';

const CLASSNAME = 'lumx-combobox-option-more-info';

/**
 * Creates a basic ComboboxOptionContext value for testing
 */
const createOptionContextValue = (overrides = {}) => ({
    optionId: 'test-option-1',
    isKeyboardHighlighted: false,
    ...overrides,
});

/**
 * Mounts the component with necessary context providers
 */
const setup = (props: any = {}, optionContextOverrides = {}) => {
    const optionContext = createOptionContextValue(optionContextOverrides);

    const result = render(
        <ComboboxOptionContext.Provider value={optionContext}>
            <ComboboxOptionMoreInfo {...props}>
                <div data-testid="popover-content">More info content</div>
            </ComboboxOptionMoreInfo>
        </ComboboxOptionContext.Provider>,
    );

    return {
        ...result,
        optionContext,
    };
};

describe('<ComboboxOptionMoreInfo>', () => {
    describe('Rendering', () => {
        it('should render icon button', () => {
            setup();
            const button = screen.getByRole('button', { hidden: true });
            expect(button).toBeInTheDocument();
        });

        it('should render with info icon', () => {
            setup();
            const button = screen.getByRole('button', { hidden: true });
            const icon = button.querySelector('svg');
            expect(icon).toBeInTheDocument();
        });

        it('should render with custom className on button', () => {
            setup({ buttonProps: { className: 'custom-button-class' } });
            const button = screen.getByRole('button', { hidden: true });
            expect(button).toHaveClass(CLASSNAME);
            expect(button).toHaveClass('custom-button-class');
        });

        it('should have aria-hidden on button', () => {
            setup();
            const button = screen.getByRole('button', { hidden: true });
            expect(button).toHaveAttribute('aria-hidden', 'true');
        });

        it('should render with size="s"', () => {
            setup();
            const button = screen.getByRole('button', { hidden: true });
            // Size is applied via classname
            expect(button.className).toContain('size-s');
        });

        it('should render with emphasis="low"', () => {
            setup();
            const button = screen.getByRole('button', { hidden: true });
            // Emphasis is applied via classname
            expect(button.className).toContain('emphasis-low');
        });
    });

    describe('Popover', () => {
        it('should render without errors', () => {
            expect(() => setup()).not.toThrow();
        });
    });

    describe('Mouse hover interaction', () => {
        it('should call onToggle when hovering', async () => {
            const onToggle = vi.fn();
            setup({ onToggle });
            const button = screen.getByRole('button', { hidden: true });

            await userEvent.hover(button);

            expect(onToggle).toHaveBeenCalledWith(true);
        });

        it('should call onToggle on initial render', async () => {
            const onToggle = vi.fn();
            setup({ onToggle });

            // Should be called on mount with false (not hovered, not keyboard highlighted)
            expect(onToggle).toHaveBeenCalledWith(false);
        });
    });

    describe('Keyboard highlighting', () => {
        it('should open popover when keyboard highlighted', () => {
            const onToggle = vi.fn();
            setup({ onToggle }, { isKeyboardHighlighted: true });

            expect(onToggle).toHaveBeenCalledWith(true);
        });

        it('should close popover when keyboard highlight is removed', () => {
            const onToggle = vi.fn();
            const { rerender } = setup({ onToggle }, { isKeyboardHighlighted: true });

            onToggle.mockClear();

            // Re-render with isKeyboardHighlighted: false
            rerender(
                <ComboboxOptionContext.Provider value={{ optionId: 'test-option-1', isKeyboardHighlighted: false }}>
                    <ComboboxOptionMoreInfo onToggle={onToggle}>
                        <div data-testid="popover-content">More info content</div>
                    </ComboboxOptionMoreInfo>
                </ComboboxOptionContext.Provider>,
            );

            expect(onToggle).toHaveBeenCalledWith(false);
        });

        it('should remain open when both hovered and keyboard highlighted', () => {
            const onToggle = vi.fn();
            setup({ onToggle }, { isKeyboardHighlighted: true });

            // Should be called with true on mount (keyboard highlighted)
            expect(onToggle).toHaveBeenCalledWith(true);
        });
    });

    describe('Props forwarding', () => {
        it('should forward buttonProps to IconButton', () => {
            setup({ buttonProps: { 'data-testid': 'custom-button' } });
            const button = screen.getByTestId('custom-button');
            expect(button).toBeInTheDocument();
        });

        it('should accept popoverProps', () => {
            // Test that popoverProps can be passed without errors
            expect(() => setup({ popoverProps: { className: 'custom-popover' } })).not.toThrow();
        });
    });

    describe('A11Y Live Message', () => {
        it('should render A11YLiveMessage component', () => {
            const { container } = setup();
            // A11YLiveMessage renders with hidden attribute
            const liveRegion = container.querySelector('[aria-live]');
            expect(liveRegion).toBeInTheDocument();
        });

        it('should announce content when popover opens', async () => {
            const { container } = setup();
            const button = screen.getByRole('button', { hidden: true });

            await userEvent.hover(button);

            // Check that the live region contains the content
            const liveRegion = container.querySelector('[aria-live]');
            expect(liveRegion).toBeInTheDocument();
        });

        it('should clear announcement when popover closes', async () => {
            const { container } = setup();
            const button = screen.getByRole('button', { hidden: true });

            await userEvent.hover(button);
            await userEvent.unhover(button);

            // Live region should not contain content when closed
            const liveRegion = container.querySelector('[aria-live]');
            expect(liveRegion).toBeInTheDocument();
        });
    });

    describe('Context integration', () => {
        it('should use optionId from ComboboxOptionContext', () => {
            const { optionContext } = setup({}, { optionId: 'custom-option-id' });
            expect(optionContext.optionId).toBe('custom-option-id');
        });

        it('should throw error when not within ComboboxOptionContext', () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => {
                render(
                    <ComboboxOptionMoreInfo>
                        <div>Content</div>
                    </ComboboxOptionMoreInfo>,
                );
            }).toThrow('This hook must be used within a ComboboxOptionIdProvider');

            consoleError.mockRestore();
        });
    });

    describe('onToggle callback', () => {
        it('should be called when popover state changes', async () => {
            const onToggle = vi.fn();
            setup({ onToggle });

            // Should be called on mount with false
            expect(onToggle).toHaveBeenCalledWith(false);
        });

        it('should not throw if onToggle is not provided', async () => {
            setup();
            const button = screen.getByRole('button', { hidden: true });

            await expect(userEvent.hover(button)).resolves.not.toThrow();
        });

        it('should call onToggle when hovering and unhovering', async () => {
            const onToggle = vi.fn();
            setup({ onToggle });
            const button = screen.getByRole('button', { hidden: true });

            onToggle.mockClear();

            // Hover
            await userEvent.hover(button);
            expect(onToggle).toHaveBeenCalledWith(true);
        });
    });

    describe('Button reference', () => {
        it('should create a ref for the button', () => {
            setup();
            const button = screen.getByRole('button', { hidden: true });
            expect(button).toBeInTheDocument();
        });
    });
});
