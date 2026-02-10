import { render, act } from '@testing-library/react';
import { createRef } from 'react';
import { vi } from 'vitest';
import { useFocusLastChipOnBackspace } from './useFocusLastChipOnBackspace';

describe('useFocusLastChipOnBackspace', () => {
    const createMockChipElement = (disabled = false) => {
        const element = document.createElement('div');
        element.setAttribute('tabindex', '0');
        if (disabled) {
            element.setAttribute('aria-disabled', 'true');
        }
        element.focus = vi.fn();
        return element;
    };

    const createMockInputElement = () => {
        const input = document.createElement('input');
        input.selectionStart = 0;
        input.selectionEnd = 0;
        return input;
    };

    it('should focus last enabled chip when backspace is pressed at start of input', () => {
        const chip1 = createMockChipElement();
        const chip2 = createMockChipElement();
        const chip3 = createMockChipElement();

        const chipRefs = {
            current: [{ current: chip1 }, { current: chip2 }, { current: chip3 }],
        };
        const inputRef = { current: createMockInputElement() };

        const TestComponent = () => {
            useFocusLastChipOnBackspace(chipRefs as any, inputRef as any);
            return null;
        };

        render(<TestComponent />);

        const event = new KeyboardEvent('keydown', { key: 'Backspace' });
        act(() => {
            inputRef.current!.dispatchEvent(event);
        });

        expect(chip3.focus).toHaveBeenCalled();
        expect(chip2.focus).not.toHaveBeenCalled();
        expect(chip1.focus).not.toHaveBeenCalled();
    });

    it('should skip disabled chips and focus the last enabled one', () => {
        const chip1 = createMockChipElement();
        const chip2 = createMockChipElement();
        const chip3 = createMockChipElement(true); // disabled

        const chipRefs = {
            current: [{ current: chip1 }, { current: chip2 }, { current: chip3 }],
        };
        const inputRef = { current: createMockInputElement() };

        const TestComponent = () => {
            useFocusLastChipOnBackspace(chipRefs as any, inputRef as any);
            return null;
        };

        render(<TestComponent />);

        const event = new KeyboardEvent('keydown', { key: 'Backspace' });
        act(() => {
            inputRef.current!.dispatchEvent(event);
        });

        expect(chip2.focus).toHaveBeenCalled();
        expect(chip3.focus).not.toHaveBeenCalled();
        expect(chip1.focus).not.toHaveBeenCalled();
    });

    it('should not focus chips when cursor is not at start of input', () => {
        const chip1 = createMockChipElement();

        const chipRefs = {
            current: [{ current: chip1 }],
        };
        const input = createMockInputElement();
        input.value = 'test text'; // add some text to the input
        input.selectionStart = 5; // cursor not at start
        input.selectionEnd = 5;
        const inputRef = { current: input };

        const TestComponent = () => {
            useFocusLastChipOnBackspace(chipRefs as any, inputRef as any);
            return null;
        };

        render(<TestComponent />);

        const event = new KeyboardEvent('keydown', { key: 'Backspace' });
        act(() => {
            inputRef.current!.dispatchEvent(event);
        });

        expect(chip1.focus).not.toHaveBeenCalled();
    });

    it('should not focus chips when other keys are pressed', () => {
        const chip1 = createMockChipElement();

        const chipRefs = {
            current: [{ current: chip1 }],
        };
        const inputRef = { current: createMockInputElement() };

        const TestComponent = () => {
            useFocusLastChipOnBackspace(chipRefs as any, inputRef as any);
            return null;
        };

        render(<TestComponent />);

        const event = new KeyboardEvent('keydown', { key: 'Delete' });
        act(() => {
            inputRef.current!.dispatchEvent(event);
        });

        expect(chip1.focus).not.toHaveBeenCalled();
    });

    it('should not focus anything when there are no chips', () => {
        const chipRefs = {
            current: [],
        };
        const inputRef = { current: createMockInputElement() };

        const TestComponent = () => {
            useFocusLastChipOnBackspace(chipRefs as any, inputRef as any);
            return null;
        };

        render(<TestComponent />);

        const event = new KeyboardEvent('keydown', { key: 'Backspace' });
        act(() => {
            inputRef.current!.dispatchEvent(event);
        });

        // No error should be thrown
        expect(true).toBe(true);
    });

    it('should not focus anything when all chips are disabled', () => {
        const chip1 = createMockChipElement(true);
        const chip2 = createMockChipElement(true);

        const chipRefs = {
            current: [{ current: chip1 }, { current: chip2 }],
        };
        const inputRef = { current: createMockInputElement() };

        const TestComponent = () => {
            useFocusLastChipOnBackspace(chipRefs as any, inputRef as any);
            return null;
        };

        render(<TestComponent />);

        const event = new KeyboardEvent('keydown', { key: 'Backspace' });
        act(() => {
            inputRef.current!.dispatchEvent(event);
        });

        expect(chip1.focus).not.toHaveBeenCalled();
        expect(chip2.focus).not.toHaveBeenCalled();
    });

    it('should handle when chipRefs.current is null', () => {
        const chipRefs = {
            current: null,
        };
        const inputRef = { current: createMockInputElement() };

        const TestComponent = () => {
            useFocusLastChipOnBackspace(chipRefs as any, inputRef as any);
            return null;
        };

        render(<TestComponent />);

        const event = new KeyboardEvent('keydown', { key: 'Backspace' });
        act(() => {
            inputRef.current!.dispatchEvent(event);
        });

        // No error should be thrown
        expect(true).toBe(true);
    });

    it('should do nothing when inputRef is not provided', () => {
        const chip1 = createMockChipElement();

        const chipRefs = {
            current: [{ current: chip1 }],
        };

        const TestComponent = () => {
            useFocusLastChipOnBackspace(chipRefs as any);
            return null;
        };

        render(<TestComponent />);

        // Hook should not throw or cause issues
        expect(chip1.focus).not.toHaveBeenCalled();
    });

    describe('findPreviousEnabledChip', () => {
        it('should find previous enabled chip from a given index', () => {
            const chip1 = createMockChipElement();
            const chip2 = createMockChipElement();
            const chip3 = createMockChipElement();

            const chipRefs = {
                current: [{ current: chip1 }, { current: chip2 }, { current: chip3 }],
            };

            let findPreviousEnabledChip: any;
            const TestComponent = () => {
                const result = useFocusLastChipOnBackspace(chipRefs as any);
                findPreviousEnabledChip = result.findPreviousEnabledChip;
                return null;
            };

            render(<TestComponent />);

            const result = findPreviousEnabledChip(1);
            expect(result).toBe(chip2);
        });

        it('should skip disabled chips when finding previous enabled chip', () => {
            const chip1 = createMockChipElement();
            const chip2 = createMockChipElement(true); // disabled
            const chip3 = createMockChipElement();

            const chipRefs = {
                current: [{ current: chip1 }, { current: chip2 }, { current: chip3 }],
            };

            let findPreviousEnabledChip: any;
            const TestComponent = () => {
                const result = useFocusLastChipOnBackspace(chipRefs as any);
                findPreviousEnabledChip = result.findPreviousEnabledChip;
                return null;
            };

            render(<TestComponent />);

            const result = findPreviousEnabledChip(2);
            expect(result).toBe(chip3);

            const result2 = findPreviousEnabledChip(1);
            expect(result2).toBe(chip1);
        });

        it('should return undefined when no enabled chip is found', () => {
            const chip1 = createMockChipElement(true);
            const chip2 = createMockChipElement(true);

            const chipRefs = {
                current: [{ current: chip1 }, { current: chip2 }],
            };

            let findPreviousEnabledChip: any;
            const TestComponent = () => {
                const result = useFocusLastChipOnBackspace(chipRefs as any);
                findPreviousEnabledChip = result.findPreviousEnabledChip;
                return null;
            };

            render(<TestComponent />);

            const result = findPreviousEnabledChip();
            expect(result).toBeUndefined();
        });

        it('should return undefined when chipRefs.current is null', () => {
            const chipRefs = createRef<any>();

            let findPreviousEnabledChip: any;
            const TestComponent = () => {
                const result = useFocusLastChipOnBackspace(chipRefs as any);
                findPreviousEnabledChip = result.findPreviousEnabledChip;
                return null;
            };

            render(<TestComponent />);

            const result = findPreviousEnabledChip();
            expect(result).toBeUndefined();
        });
    });
});
