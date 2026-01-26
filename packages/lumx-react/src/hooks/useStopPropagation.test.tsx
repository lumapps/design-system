import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { useStopPropagation } from './useStopPropagation';

describe('useStopPropagation', () => {
    it('should call handler and stop propagation', () => {
        const handlerCallback = vi.fn();

        let result: any;
        const TestComponent = ({ handler }: any) => {
            result = useStopPropagation(handler);
            return null;
        };
        render(<TestComponent handler={handlerCallback} />);

        const event = { stopPropagation: vi.fn() };
        result(event as any);

        expect(handlerCallback).toHaveBeenCalledWith(event);
        expect(event.stopPropagation).toHaveBeenCalled();
    });
});
