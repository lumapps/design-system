import React from 'react';
import { render, act } from '@testing-library/react';
import { vi } from 'vitest';
import { CLASSNAME as CHIP_CLASSNAME } from '@lumx/core/js/components/Chip';
import { useSelectionChipGroupEvents, UseSelectionChipGroupEventsOptions } from './useSelectionChipGroupEvents';

/**
 * Helper: creates a container div with chip elements.
 * Returns the container and an array of chip elements with mocked focus.
 */
const createChipGroupDOM = (chips: Array<{ disabled?: boolean }>) => {
    const container = document.createElement('div');
    const chipElements: HTMLAnchorElement[] = [];
    chips.forEach((chip, index) => {
        const el = document.createElement('a');
        el.className = CHIP_CLASSNAME;
        el.setAttribute('data-option-index', String(index));
        el.setAttribute('tabindex', '0');
        if (chip.disabled) {
            el.setAttribute('aria-disabled', 'true');
        }
        el.focus = vi.fn();
        container.appendChild(el);
        chipElements.push(el);
    });
    document.body.appendChild(container);
    return { container, chips: chipElements };
};

const createMockInputElement = () => {
    const input = document.createElement('input');
    input.selectionStart = 0;
    input.selectionEnd = 0;
    return input;
};

const TestComponent = ({ options }: { options: UseSelectionChipGroupEventsOptions }) => {
    useSelectionChipGroupEvents(options);
    return null;
};

describe('useSelectionChipGroupEvents', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('input backspace handler', () => {
        it('should focus last enabled chip when backspace is pressed at start of input', () => {
            const { container, chips } = createChipGroupDOM([{}, {}, {}]);
            const inputRef = { current: createMockInputElement() };
            const containerRef = { current: container } as React.RefObject<HTMLElement>;

            render(<TestComponent options={{ onRemove: vi.fn(), containerRef, inputRef }} />);

            const event = new KeyboardEvent('keydown', { key: 'Backspace' });
            act(() => {
                inputRef.current!.dispatchEvent(event);
            });

            expect(chips[2].focus).toHaveBeenCalled();
            expect(chips[1].focus).not.toHaveBeenCalled();
            expect(chips[0].focus).not.toHaveBeenCalled();
        });

        it('should skip disabled chips and focus the last enabled one', () => {
            const { container, chips } = createChipGroupDOM([{}, {}, { disabled: true }]);
            const inputRef = { current: createMockInputElement() };
            const containerRef = { current: container } as React.RefObject<HTMLElement>;

            render(<TestComponent options={{ onRemove: vi.fn(), containerRef, inputRef }} />);

            const event = new KeyboardEvent('keydown', { key: 'Backspace' });
            act(() => {
                inputRef.current!.dispatchEvent(event);
            });

            expect(chips[1].focus).toHaveBeenCalled();
            expect(chips[2].focus).not.toHaveBeenCalled();
            expect(chips[0].focus).not.toHaveBeenCalled();
        });

        it('should not focus chips when cursor is not at start of input', () => {
            const { container, chips } = createChipGroupDOM([{}]);
            const input = createMockInputElement();
            input.value = 'test text';
            input.selectionStart = 5;
            input.selectionEnd = 5;
            const inputRef = { current: input };
            const containerRef = { current: container } as React.RefObject<HTMLElement>;

            render(<TestComponent options={{ onRemove: vi.fn(), containerRef, inputRef }} />);

            const event = new KeyboardEvent('keydown', { key: 'Backspace' });
            act(() => {
                inputRef.current!.dispatchEvent(event);
            });

            expect(chips[0].focus).not.toHaveBeenCalled();
        });

        it('should not focus chips when other keys are pressed', () => {
            const { container, chips } = createChipGroupDOM([{}]);
            const inputRef = { current: createMockInputElement() };
            const containerRef = { current: container } as React.RefObject<HTMLElement>;

            render(<TestComponent options={{ onRemove: vi.fn(), containerRef, inputRef }} />);

            const event = new KeyboardEvent('keydown', { key: 'Delete' });
            act(() => {
                inputRef.current!.dispatchEvent(event);
            });

            expect(chips[0].focus).not.toHaveBeenCalled();
        });

        it('should not focus anything when there are no chips', () => {
            const { container } = createChipGroupDOM([]);
            const inputRef = { current: createMockInputElement() };
            const containerRef = { current: container } as React.RefObject<HTMLElement>;

            render(<TestComponent options={{ onRemove: vi.fn(), containerRef, inputRef }} />);

            const event = new KeyboardEvent('keydown', { key: 'Backspace' });
            act(() => {
                inputRef.current!.dispatchEvent(event);
            });

            // No error should be thrown
            expect(true).toBe(true);
        });

        it('should not focus anything when all chips are disabled', () => {
            const { container, chips } = createChipGroupDOM([{ disabled: true }, { disabled: true }]);
            const inputRef = { current: createMockInputElement() };
            const containerRef = { current: container } as React.RefObject<HTMLElement>;

            render(<TestComponent options={{ onRemove: vi.fn(), containerRef, inputRef }} />);

            const event = new KeyboardEvent('keydown', { key: 'Backspace' });
            act(() => {
                inputRef.current!.dispatchEvent(event);
            });

            expect(chips[0].focus).not.toHaveBeenCalled();
            expect(chips[1].focus).not.toHaveBeenCalled();
        });

        it('should do nothing when inputRef is not provided', () => {
            const { container, chips } = createChipGroupDOM([{}]);
            const containerRef = { current: container } as React.RefObject<HTMLElement>;

            render(<TestComponent options={{ onRemove: vi.fn(), containerRef }} />);

            expect(chips[0].focus).not.toHaveBeenCalled();
        });

        it('should handle when container is null', () => {
            const inputRef = { current: createMockInputElement() };
            const containerRef = { current: null } as React.RefObject<HTMLElement>;

            render(<TestComponent options={{ onRemove: vi.fn(), containerRef, inputRef }} />);

            const event = new KeyboardEvent('keydown', { key: 'Backspace' });
            act(() => {
                inputRef.current!.dispatchEvent(event);
            });

            // No error should be thrown
            expect(true).toBe(true);
        });
    });
});
