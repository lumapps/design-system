import { render } from '@testing-library/react';
import { vi } from 'vitest';
import useEventCallback from './useEventCallback';

describe('useEventCallback', () => {
    it('should return a stable callback', () => {
        const fn = vi.fn();
        let result: any;
        const TestComponent = ({ cb }: any) => {
            result = useEventCallback(cb);
            return null;
        };
        const { rerender } = render(<TestComponent cb={fn} />);

        const firstCallback = result;
        rerender(<TestComponent cb={vi.fn()} />);
        const secondCallback = result;

        expect(firstCallback).toBe(secondCallback);
    });

    it('should call the latest function', () => {
        const fn1 = vi.fn();
        const fn2 = vi.fn();
        let result: any;
        const TestComponent = ({ cb }: any) => {
            result = useEventCallback(cb);
            return null;
        };
        const { rerender } = render(<TestComponent cb={fn1} />);

        result('arg1');
        expect(fn1).toHaveBeenCalledWith('arg1');

        rerender(<TestComponent cb={fn2} />);
        result('arg2');
        expect(fn2).toHaveBeenCalledWith('arg2');
        expect(fn1).not.toHaveBeenCalledWith('arg2');
    });
});
