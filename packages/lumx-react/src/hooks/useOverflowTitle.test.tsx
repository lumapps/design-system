import { render, act } from '@testing-library/react';
import { useOverflowTitle } from './useOverflowTitle';

describe('useOverflowTitle', () => {
    it('should set label if text overflows', () => {
        const element = document.createElement('div');
        element.innerText = 'Long text';
        Object.defineProperty(element, 'offsetWidth', { value: 50 });
        Object.defineProperty(element, 'scrollWidth', { value: 100 });

        let result: any;
        const TestComponent = ({ text }: any) => {
            result = useOverflowTitle(text);
            return null;
        };
        render(<TestComponent text="Long text" />);

        act(() => {
            result.labelRef(element);
        });

        expect(result.title).toBe('Long text');
    });
});
