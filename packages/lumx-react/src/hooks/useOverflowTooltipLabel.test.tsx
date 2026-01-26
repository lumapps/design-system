import { render, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useOverflowTooltipLabel } from './useOverflowTooltipLabel';

// Mock Tooltip context
vi.mock('@lumx/react/components/tooltip/context', () => ({
    useTooltipContext: () => null,
}));

describe('useOverflowTooltipLabel', () => {
    it('should set label if text overflows', () => {
        const element = document.createElement('div');
        element.innerText = 'Long text';
        // Mock overflow properties
        Object.defineProperty(element, 'offsetWidth', { value: 50 });
        Object.defineProperty(element, 'scrollWidth', { value: 100 });

        let result: any;
        const TestComponent = ({ text }: any) => {
            result = useOverflowTooltipLabel(text);
            return null;
        };
        render(<TestComponent text="Long text" />);

        act(() => {
            result.labelRef(element);
        });

        expect(result.tooltipLabel).toBe('Long text');
    });

    it('should NOT set label if text does not overflow', () => {
        const element = document.createElement('div');
        element.innerText = 'Short text';
        Object.defineProperty(element, 'offsetWidth', { value: 100 });
        Object.defineProperty(element, 'scrollWidth', { value: 100 });

        let result: any;
        const TestComponent = ({ text }: any) => {
            result = useOverflowTooltipLabel(text);
            return null;
        };
        render(<TestComponent text="Short text" />);

        act(() => {
            result.labelRef(element);
        });

        expect(result.tooltipLabel).toBeUndefined();
    });
});
