import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { useInterval } from './useInterval';

const TestComponent = ({ callback, delay }: any) => {
    useInterval(callback, delay);
    return null;
};

describe('useInterval', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should call callback repeatedly', () => {
        const callback = vi.fn();
        render(<TestComponent callback={callback} delay={1000} />);

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should not call callback if delay is null', () => {
        const callback = vi.fn();
        render(<TestComponent callback={callback} delay={null} />);

        vi.advanceTimersByTime(1000);
        expect(callback).not.toHaveBeenCalled();
    });
});
