import { render, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useChipGroupNavigation } from './useChipGroupNavigation';

describe('useChipGroupNavigation', () => {
    const chipsToTest = ['chip1', 'chip2'];

    it('should set active chip on first backspace', () => {
        const onDeletedCallback = vi.fn();

        let result: any;
        const TestComponent = ({ chips, onDeleted }: any) => {
            result = useChipGroupNavigation(chips, onDeleted);
            return null;
        };
        render(<TestComponent chips={chipsToTest} onDeleted={onDeletedCallback} />);

        expect(result.activeChip).toBe(-1);

        act(() => {
            result.onBackspacePressed();
        });
        expect(result.activeChip).toBe(1);
        expect(onDeletedCallback).not.toHaveBeenCalled();
    });

    it('should delete chip on second backspace', () => {
        const onDeletedCallback = vi.fn();

        let result: any;
        const TestComponent = ({ chips, onDeleted }: any) => {
            result = useChipGroupNavigation(chips, onDeleted);
            return null;
        };
        render(<TestComponent chips={chipsToTest} onDeleted={onDeletedCallback} />);

        act(() => {
            result.onBackspacePressed();
        });
        act(() => {
            result.onBackspacePressed();
        });

        expect(onDeletedCallback).toHaveBeenCalledWith('chip2');
        expect(result.activeChip).toBe(-1);
    });
});
