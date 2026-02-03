import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { useInfiniteScroll } from './useInfiniteScroll';

const TestComponent = ({ elementRef, callback, callbackOnMount, scrollTriggerMargin }: any) => {
    useInfiniteScroll(elementRef, callback, callbackOnMount, scrollTriggerMargin);
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

    it('should not call callback when not at bottom', () => {
        const callback = vi.fn();
        const div = document.createElement('div');
        // Mock scroll properties - not at bottom
        Object.defineProperty(div, 'scrollHeight', { value: 1000 });
        Object.defineProperty(div, 'clientHeight', { value: 500 });
        Object.defineProperty(div, 'scrollTop', { value: 100 }); // 1000 - (100 + 500) = 400 > 5 (margin)

        const ref = { current: div };
        render(<TestComponent elementRef={ref} callback={callback} />);

        div.dispatchEvent(new Event('scroll'));
        expect(callback).not.toHaveBeenCalled();
    });

    it('should call callback on resize event when at bottom', () => {
        const callback = vi.fn();
        const div = document.createElement('div');
        // Mock scroll properties - at bottom
        Object.defineProperty(div, 'scrollHeight', { value: 1000 });
        Object.defineProperty(div, 'clientHeight', { value: 500 });
        Object.defineProperty(div, 'scrollTop', { value: 495 });

        const ref = { current: div };
        render(<TestComponent elementRef={ref} callback={callback} />);

        callback.mockClear(); // Clear the initial call on mount
        div.dispatchEvent(new Event('resize'));
        expect(callback).toHaveBeenCalled();
    });

    it('should use custom scrollTriggerMargin', () => {
        const callback = vi.fn();
        const div = document.createElement('div');
        const customMargin = 50;
        // Mock scroll properties - within custom margin but not default margin
        Object.defineProperty(div, 'scrollHeight', { value: 1000 });
        Object.defineProperty(div, 'clientHeight', { value: 500 });
        Object.defineProperty(div, 'scrollTop', { value: 460 }); // 1000 - (460 + 500) = 40 <= 50 but > 5

        const ref = { current: div };
        render(<TestComponent elementRef={ref} callback={callback} scrollTriggerMargin={customMargin} />);

        // Should be called on mount because it's within custom margin
        expect(callback).toHaveBeenCalled();
    });

    it('should not call callback when ref is null', () => {
        const callback = vi.fn();
        const ref = { current: null };
        render(<TestComponent elementRef={ref} callback={callback} />);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should not call callback when callback is undefined', () => {
        const div = document.createElement('div');
        const ref = { current: div };

        // Should not throw error
        expect(() => {
            render(<TestComponent elementRef={ref} callback={undefined} />);
        }).not.toThrow();
    });

    it('should remove event listeners on unmount', () => {
        const callback = vi.fn();
        const div = document.createElement('div');
        const removeEventListenerSpy = vi.spyOn(div, 'removeEventListener');

        const ref = { current: div };
        const { unmount } = render(<TestComponent elementRef={ref} callback={callback} />);

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should call callback immediately on mount if already at bottom', () => {
        const callback = vi.fn();
        const div = document.createElement('div');
        // Mock scroll properties - already at bottom
        Object.defineProperty(div, 'scrollHeight', { value: 1000 });
        Object.defineProperty(div, 'clientHeight', { value: 500 });
        Object.defineProperty(div, 'scrollTop', { value: 500 }); // At exact bottom

        const ref = { current: div };
        render(<TestComponent elementRef={ref} callback={callback} />);

        // Should be called once on mount
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
