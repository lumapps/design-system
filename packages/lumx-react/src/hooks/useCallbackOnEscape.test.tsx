import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { useCallbackOnEscape } from './useCallbackOnEscape';

const TestComponent = ({ callback, enabled }: any) => {
    useCallbackOnEscape(callback, enabled);
    return null;
};

describe('useCallbackOnEscape', () => {
    it('should call callback on escape press', () => {
        const callback = vi.fn();
        render(<TestComponent callback={callback} enabled />);

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.body.dispatchEvent(event);

        expect(callback).toHaveBeenCalled();
    });

    it('should not call callback if disabled', () => {
        const callback = vi.fn();
        render(<TestComponent callback={callback} enabled={false} />);

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.body.dispatchEvent(event);

        expect(callback).not.toHaveBeenCalled();
    });
});
