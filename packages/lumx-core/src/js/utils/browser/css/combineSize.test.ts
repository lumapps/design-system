import { cssMin, cssMax } from './combineSize';

describe('cssMin', () => {
    it('should combine two values with min()', () => {
        expect(cssMin('100px', '200px')).toBe('min(100px, 200px)');
    });

    it('should return first value when second is undefined', () => {
        expect(cssMin('100px', undefined)).toBe('100px');
    });

    it('should return second value when first is undefined', () => {
        expect(cssMin(undefined, '200px')).toBe('200px');
    });

    it('should return empty string when both are undefined', () => {
        expect(cssMin(undefined, undefined)).toBe('');
    });

    it('should return first value when second is empty string', () => {
        expect(cssMin('100px', '')).toBe('100px');
    });

    it('should return second value when first is empty string', () => {
        expect(cssMin('', '200px')).toBe('200px');
    });
});

describe('cssMax', () => {
    it('should combine two values with max()', () => {
        expect(cssMax('200px', '100px')).toBe('max(200px, 100px)');
    });

    it('should return first value when second is undefined', () => {
        expect(cssMax('200px', undefined)).toBe('200px');
    });

    it('should return second value when first is undefined', () => {
        expect(cssMax(undefined, '100px')).toBe('100px');
    });

    it('should return empty string when both are undefined', () => {
        expect(cssMax(undefined, undefined)).toBe('');
    });
});

describe('cssMin with CSS vars', () => {
    it('should combine a CSS variable with a pixel value', () => {
        expect(cssMin('200px', 'var(--lumx-size-m)')).toBe('min(200px, var(--lumx-size-m))');
    });
});

describe('cssMax with CSS vars', () => {
    it('should combine a CSS variable with a pixel value', () => {
        expect(cssMax('150px', 'var(--lumx-size-l)')).toBe('max(150px, var(--lumx-size-l))');
    });
});
