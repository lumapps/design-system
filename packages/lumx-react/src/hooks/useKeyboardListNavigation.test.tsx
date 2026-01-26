import { render, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useKeyboardListNavigation } from './useKeyboardListNavigation';

describe('useKeyboardListNavigation', () => {
    const itemsToTest = ['item1', 'item2', 'item3'];

    it('should navigate down with ArrowDown', () => {
        const onSelectedCallback = vi.fn();
        const ref = { current: document.createElement('div') };

        let result: any;
        const TestComponent = ({ items, elementRef, onSelected }: any) => {
            result = useKeyboardListNavigation(items, elementRef, onSelected);
            return null;
        };
        render(<TestComponent items={itemsToTest} elementRef={ref as any} onSelected={onSelectedCallback} />);

        act(() => {
            result.onKeyboardNavigation(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
        });
        expect(result.activeItemIndex).toBe(0);

        act(() => {
            result.onKeyboardNavigation(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
        });
        expect(result.activeItemIndex).toBe(1);
    });

    it('should call onListItemSelected on Enter', () => {
        const onSelectedCallback = vi.fn();
        const ref = { current: document.createElement('div') };

        let result: any;
        const TestComponent = ({ items, elementRef, onSelected }: any) => {
            result = useKeyboardListNavigation(items, elementRef, onSelected);
            return null;
        };
        render(<TestComponent items={itemsToTest} elementRef={ref as any} onSelected={onSelectedCallback} />);

        // Navigate to second item
        act(() => {
            result.onKeyboardNavigation(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
        });
        act(() => {
            result.onKeyboardNavigation(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
        });

        act(() => {
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            Object.defineProperty(event, 'currentTarget', { value: { blur: vi.fn() } });
            result.onKeyboardNavigation(event as any);
        });
        expect(onSelectedCallback).toHaveBeenCalledWith('item2');
        // Index should be reset after selection
        expect(result.activeItemIndex).toBe(-1);
    });
});
