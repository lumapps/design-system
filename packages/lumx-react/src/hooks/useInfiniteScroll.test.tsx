import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { useInfiniteScroll } from './useInfiniteScroll';

const TestComponent = ({ elementRef, callback, callbackOnMount }: any) => {
    useInfiniteScroll(elementRef, callback, callbackOnMount);
    return null;
};

describe('useInfiniteScroll', () => {
    it('should call callback when reaching bottom', () => {
        const callback = vi.fn();
        const div = document.createElement('div');
        // Mock scroll properties
        Object.defineProperty(div, 'scrollHeight', { value: 1000 });
        Object.defineProperty(div, 'clientHeight', { value: 500 });
        Object.defineProperty(div, 'scrollTop', { value: 495 }); // 1000 - (495 + 500) = 5 <= 5 (margin)

        const ref = { current: div };
        render(<TestComponent elementRef={ref} callback={callback} />);

        div.dispatchEvent(new Event('scroll'));
        expect(callback).toHaveBeenCalled();
    });

    it('should call callback on mount if requested', () => {
        const callback = vi.fn();
        const ref = { current: document.createElement('div') };
        render(<TestComponent elementRef={ref} callback={callback} callbackOnMount />);

        expect(callback).toHaveBeenCalled();
    });
});
