import { render, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useSizeOnWindowResize } from './useSizeOnWindowResize';

describe('useSizeOnWindowResize', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should update size on window resize', () => {
        const div = document.createElement('div');
        const ref = { current: div };

        vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50 } as any);

        let result: any;
        const TestComponent = ({ elementRef }: any) => {
            result = useSizeOnWindowResize(elementRef);
            return null;
        };
        render(<TestComponent elementRef={ref} />);

        expect(result[0]).toEqual({ width: 100, height: 50 });

        vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({ width: 200, height: 100 } as any);

        act(() => {
            window.dispatchEvent(new Event('resize'));
            vi.advanceTimersByTime(10);
        });

        expect(result[0]).toEqual({ width: 200, height: 100 });
    });
});
