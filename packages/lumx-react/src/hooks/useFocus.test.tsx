import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { useFocus } from './useFocus';

const TestComponent = ({ element, shouldFocus }: any) => {
    useFocus(element, shouldFocus);
    return null;
};

describe('useFocus', () => {
    it('should focus element when shouldFocus is true', () => {
        const button = document.createElement('button');
        const focusSpy = vi.spyOn(button, 'focus');

        render(<TestComponent element={button} shouldFocus />);
        expect(focusSpy).toHaveBeenCalled();
    });

    it('should not focus element when shouldFocus is false', () => {
        const button = document.createElement('button');
        const focusSpy = vi.spyOn(button, 'focus');

        render(<TestComponent element={button} shouldFocus={false} />);
        expect(focusSpy).not.toHaveBeenCalled();
    });
});
