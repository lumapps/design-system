import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { OnBeforeUnmount } from './OnBeforeUnmount';

describe('OnBeforeUnmount', () => {
    it('should call callback on unmount', () => {
        const callback = vi.fn();
        const ref = { current: callback };
        const { unmount } = render(<OnBeforeUnmount callbackRef={ref as any} />);

        expect(callback).not.toHaveBeenCalled();
        unmount();
        expect(callback).toHaveBeenCalled();
    });
});
