import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { useFocusWithin } from './useFocusWithin';

const TestComponent = (props: any) => {
    useFocusWithin(props);
    return null;
};

describe('useFocusWithin', () => {
    it('should call onFocusIn when focus enter element', () => {
        const onFocusIn = vi.fn();
        const onFocusOut = vi.fn();
        const element = document.createElement('div');
        render(<TestComponent element={element} onFocusIn={onFocusIn} onFocusOut={onFocusOut} />);

        element.dispatchEvent(new FocusEvent('focusin'));
        expect(onFocusIn).toHaveBeenCalled();
    });

    it('should call onFocusOut when focus leaves element', () => {
        const onFocusIn = vi.fn();
        const onFocusOut = vi.fn();
        const element = document.createElement('div');
        render(<TestComponent element={element} onFocusIn={onFocusIn} onFocusOut={onFocusOut} />);

        element.dispatchEvent(new FocusEvent('focusout'));
        expect(onFocusOut).toHaveBeenCalled();
    });
});
