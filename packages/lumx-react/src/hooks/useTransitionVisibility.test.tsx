import { render, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useTransitionVisibility } from './useTransitionVisibility';

describe('useTransitionVisibility', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should stay visible during transition timeout', () => {
        const div = document.createElement('div');
        const ref = { current: div };
        // Mock transition support
        (window as any).TransitionEvent = vi.fn();

        let result: any;
        const TestComponent = ({ visible }: any) => {
            result = useTransitionVisibility(ref as any, visible, 1000);
            return null;
        };
        const { rerender } = render(<TestComponent visible />);

        expect(result).toBe(true);

        rerender(<TestComponent visible={false} />);
        // Should still be true during timeout
        expect(result).toBe(true);

        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(result).toBe(false);
    });
});
