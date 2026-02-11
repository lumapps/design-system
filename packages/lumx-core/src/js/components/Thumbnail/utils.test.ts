import { describe, it, expect } from 'vitest';
import { AspectRatio } from '../../constants';
import {
    getImageLoadingState,
    getImageSize,
    shiftPosition,
    calculateFocusPointStyle,
    type GetImageSizeParams,
    type CalculateFocusPointStyleParams,
} from './utils';

// Mock HTMLImageElement for testing
const createMockImage = (props: Partial<HTMLImageElement> = {}): HTMLImageElement => ({
    complete: false,
    getAttribute: (attr: string) => (attr === 'src' && props.src) || null,
    ...props,
} as unknown as HTMLImageElement);

describe('getImageLoadingState', () => {
    it('should return hasError when error event is provided', () => {
        const img = createMockImage();
        const errorEvent = { type: 'error' } as Event;
        expect(getImageLoadingState(img, errorEvent)).toBe('hasError');
    });

    it('should return hasError when image is complete but has no src', () => {
        const img = createMockImage({ complete: true });
        expect(getImageLoadingState(img)).toBe('hasError');
    });

    it('should return isLoading when image is null', () => {
        expect(getImageLoadingState(null)).toBe('isLoading');
    });

    it('should return isLoading when image is undefined', () => {
        expect(getImageLoadingState(undefined)).toBe('isLoading');
    });

    it('should return isLoading when image is not complete', () => {
        const img = createMockImage({ src: 'test.jpg', complete: false });
        expect(getImageLoadingState(img)).toBe('isLoading');
    });

    it('should return isLoaded when image is complete and has src', () => {
        const img = createMockImage({ src: 'test.jpg', complete: true });
        expect(getImageLoadingState(img)).toBe('isLoaded');
    });
});

describe('getImageSize', () => {
    it('should return undefined when image URL is not provided', () => {
        const params: GetImageSizeParams = {
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5 },
            isLoaded: true,
        };
        expect(getImageSize(params)).toBeUndefined();
    });

    it('should return undefined when aspectRatio is original', () => {
        const params: GetImageSizeParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.original,
            focusPoint: { x: 0.5 },
            isLoaded: true,
        };
        expect(getImageSize(params)).toBeUndefined();
    });

    it('should return undefined when focus point is not set', () => {
        const params: GetImageSizeParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            isLoaded: true,
        };
        expect(getImageSize(params)).toBeUndefined();
    });

    it('should return size from props when width and height are provided', () => {
        const params: GetImageSizeParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5 },
            width: 800,
            height: 600,
            isLoaded: true,
        };
        expect(getImageSize(params)).toEqual({ width: 800, height: 600 });
    });

    it('should return natural size from loaded element when props not provided', () => {
        const img = createMockImage({ naturalWidth: 1024, naturalHeight: 768 });

        const params: GetImageSizeParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5 },
            element: img,
            isLoaded: true,
        };
        expect(getImageSize(params)).toEqual({ width: 1024, height: 768 });
    });

    it('should return undefined when element is not loaded', () => {
        const img = createMockImage({ naturalWidth: 1024, naturalHeight: 768 });

        const params: GetImageSizeParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5 },
            element: img,
            isLoaded: false,
        };
        expect(getImageSize(params)).toBeUndefined();
    });

    it('should prefer props width/height over element natural size', () => {
        const img = createMockImage({ naturalWidth: 1024, naturalHeight: 768 });

        const params: GetImageSizeParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5 },
            width: 800,
            height: 600,
            element: img,
            isLoaded: true,
        };
        expect(getImageSize(params)).toEqual({ width: 800, height: 600 });
    });
});

describe('shiftPosition', () => {
    it('should return 0 when scaled size equals container size', () => {
        const result = shiftPosition({
            scale: 1,
            focusPoint: 0.5,
            imageSize: 100,
            containerSize: 100,
        });
        expect(result).toBe(0);
    });

    it('should calculate correct shift for center focus point', () => {
        const result = shiftPosition({
            scale: 0.5,
            focusPoint: 0.5,
            imageSize: 200,
            containerSize: 100,
        });
        expect(result).toBe(50);
    });

    it('should clamp shift to 0 when focus point is at start', () => {
        const result = shiftPosition({
            scale: 0.5,
            focusPoint: 0,
            imageSize: 200,
            containerSize: 100,
        });
        expect(result).toBe(0);
    });

    it('should clamp shift to 100 when focus point is at end', () => {
        const result = shiftPosition({
            scale: 0.5,
            focusPoint: 1,
            imageSize: 200,
            containerSize: 100,
        });
        expect(result).toBe(100);
    });

    it('should handle various scale factors correctly', () => {
        const result = shiftPosition({
            scale: 0.75,
            focusPoint: 0.75,
            imageSize: 400,
            containerSize: 200,
        });
        // scaledSize = 400 / 0.75 = 533.33
        // scaledFocusHeight = 0.75 * 533.33 = 400
        // startFocus = 400 - 100 = 300
        // shift = 300 / (533.33 - 200) = 300 / 333.33 = 0.899...
        // result = floor(min(max(0.899, 0), 1) * 100) = floor(89.9) = 89
        expect(result).toBe(89);
    });
});

describe('calculateFocusPointStyle', () => {
    it('should return empty object when image URL is not provided', () => {
        const params: CalculateFocusPointStyleParams = {
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5 },
        };
        expect(calculateFocusPointStyle(params)).toEqual({});
    });

    it('should return empty object when aspectRatio is original', () => {
        const params: CalculateFocusPointStyleParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.original,
            focusPoint: { x: 0.5 },
        };
        expect(calculateFocusPointStyle(params)).toEqual({});
    });

    it('should return empty object when focus point is not set', () => {
        const params: CalculateFocusPointStyleParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
        };
        expect(calculateFocusPointStyle(params)).toEqual({});
    });

    it('should return visibility hidden when element is not provided', () => {
        const params: CalculateFocusPointStyleParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5 },
            imageSize: { width: 800, height: 600 },
        };
        expect(calculateFocusPointStyle(params)).toEqual({ visibility: 'hidden' });
    });

    it('should return visibility hidden when imageSize is not provided', () => {
        const img = createMockImage();
        const params: CalculateFocusPointStyleParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5 },
            element: img,
        };
        expect(calculateFocusPointStyle(params)).toEqual({ visibility: 'hidden' });
    });

    it('should return empty object when containerSize is not provided', () => {
        const img = createMockImage();
        const params: CalculateFocusPointStyleParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5 },
            element: img,
            imageSize: { width: 800, height: 600 },
        };
        expect(calculateFocusPointStyle(params)).toEqual({});
    });

    it('should calculate objectPosition correctly', () => {
        const img = createMockImage();
        const params: CalculateFocusPointStyleParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5, y: 0.5 },
            element: img,
            // Use portrait image (height > width) to allow vertical positioning
            imageSize: { width: 600, height: 900 },
            containerSize: { width: 400, height: 500 },
        };
        const result = calculateFocusPointStyle(params);
        expect(result).toHaveProperty('objectPosition');
        // With these dimensions, width scales to fit exactly (0% X shift)
        // Height is larger so Y can shift based on focus point
        expect(result.objectPosition).toMatch(/^\d+% \d+%$/);
    });

    it('should calculate objectPosition for top-left focus point', () => {
        const img = createMockImage();
        const params: CalculateFocusPointStyleParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: -1, y: 1 }, // Top-left
            element: img,
            imageSize: { width: 800, height: 600 },
            containerSize: { width: 400, height: 300 },
        };
        const result = calculateFocusPointStyle(params);
        expect(result).toHaveProperty('objectPosition');
        expect(result.objectPosition).toBe('0% 0%');
    });

    it('should calculate objectPosition for bottom-right focus point', () => {
        const img = createMockImage();
        const params: CalculateFocusPointStyleParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 1, y: -1 }, // Bottom-right
            element: img,
            // Use portrait image to allow vertical positioning
            imageSize: { width: 600, height: 900 },
            containerSize: { width: 400, height: 500 },
        };
        const result = calculateFocusPointStyle(params);
        expect(result).toHaveProperty('objectPosition');
        // With these dimensions, width scales to fit exactly (0% X shift)
        // Y should be at maximum (100%) for bottom focus
        expect(result.objectPosition).toBe('0% 100%');
    });

    it('should handle focus point with only x coordinate', () => {
        const img = createMockImage();
        const params: CalculateFocusPointStyleParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { x: 0.5 }, // Only X set
            element: img,
            imageSize: { width: 1200, height: 800 },
            containerSize: { width: 500, height: 300 },
        };
        const result = calculateFocusPointStyle(params);
        expect(result).toHaveProperty('objectPosition');
        // With these dimensions, width scales to fit exactly (0% X shift)
        // Y uses default center positioning
        expect(result.objectPosition).toMatch(/^\d+% \d+%$/);
    });

    it('should handle focus point with only y coordinate', () => {
        const img = createMockImage();
        const params: CalculateFocusPointStyleParams = {
            image: 'test.jpg',
            aspectRatio: AspectRatio.square,
            focusPoint: { y: 0.5 }, // Only Y set
            element: img,
            imageSize: { width: 600, height: 900 },
            containerSize: { width: 400, height: 500 },
        };
        const result = calculateFocusPointStyle(params);
        expect(result).toHaveProperty('objectPosition');
        // With these dimensions, width scales to fit exactly (0% X shift)
        // Y positioning based on focus point
        expect(result.objectPosition).toMatch(/^\d+% \d+%$/);
    });
});
