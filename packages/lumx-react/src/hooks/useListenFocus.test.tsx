import { render, act } from '@testing-library/react';
import { useListenFocus } from './useListenFocus';

describe('useListenFocus', () => {
    it('should track focus status', () => {
        const element = document.createElement('button');
        const ref = { current: element };

        let result: any;
        const TestComponent = ({ elementRef }: any) => {
            result = useListenFocus(elementRef);
            return null;
        };
        render(<TestComponent elementRef={ref as any} />);

        expect(result).toBe(false);

        act(() => {
            element.dispatchEvent(new FocusEvent('focus'));
        });
        expect(result).toBe(true);

        act(() => {
            element.dispatchEvent(new FocusEvent('blur'));
        });
        expect(result).toBe(false);
    });
});
