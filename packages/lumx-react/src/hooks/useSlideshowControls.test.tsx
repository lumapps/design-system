import { render, act } from '@testing-library/react';
import { useSlideshowControls } from './useSlideshowControls';

describe('useSlideshowControls', () => {
    it('should navigate between slides', () => {
        let result: any;
        const TestComponent = ({ itemsCount }: any) => {
            result = useSlideshowControls({ itemsCount });
            return null;
        };
        render(<TestComponent itemsCount={3} />);

        expect(result.activeIndex).toBe(0);

        act(() => {
            result.onNextClick(true);
        });
        expect(result.activeIndex).toBe(1);

        act(() => {
            result.onPreviousClick(true);
        });
        expect(result.activeIndex).toBe(0);
    });

    it('should loopback correctly', () => {
        let result: any;
        const TestComponent = ({ itemsCount }: any) => {
            result = useSlideshowControls({ itemsCount });
            return null;
        };
        render(<TestComponent itemsCount={2} />);

        act(() => {
            result.onNextClick(true);
        });
        expect(result.activeIndex).toBe(1);

        act(() => {
            result.onNextClick(true);
        });
        expect(result.activeIndex).toBe(0);
    });
});
