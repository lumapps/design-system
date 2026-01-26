import { render, act } from '@testing-library/react';
import { useImageSize } from './useImageSize';

describe('useImageSize', () => {
    it('should update size when image loads', () => {
        const img = document.createElement('img');
        // Define naturalWidth/naturalHeight since JSDOM might not have them as settable
        Object.defineProperty(img, 'naturalWidth', { value: 100 });
        Object.defineProperty(img, 'naturalHeight', { value: 200 });

        let result: any;
        const TestComponent = ({ elementRef }: any) => {
            result = useImageSize(elementRef);
            return null;
        };

        const ref = { current: img };
        render(<TestComponent elementRef={ref} />);

        expect(result).toBeNull();

        act(() => {
            img.dispatchEvent(new Event('load'));
        });

        expect(result).toEqual({ width: 100, height: 200 });
    });
});
