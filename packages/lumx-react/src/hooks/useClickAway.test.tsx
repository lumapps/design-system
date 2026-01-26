import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { useClickAway } from './useClickAway';

const TestComponent = ({ args }: any) => {
    useClickAway(args);
    return null;
};

describe('useClickAway', () => {
    it('should call callback when clicking away', () => {
        const callback = vi.fn();
        const div = document.createElement('div');
        const refs = { current: [{ current: div }] };
        render(<TestComponent args={{ callback, childrenRefs: refs as any }} />);

        // Click on div should not trigger
        div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(callback).not.toHaveBeenCalled();

        // Click on document body should trigger
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(callback).toHaveBeenCalled();
    });
});
