import { resolveCssSize } from './resolveCssSize';

describe('resolveCssSize', () => {
    it('should resolve a t-shirt size to a CSS variable', () => {
        expect(resolveCssSize('m')).toBe('var(--lumx-size-m)');
    });

    it('should resolve a large t-shirt size', () => {
        expect(resolveCssSize('xl')).toBe('var(--lumx-size-xl)');
    });

    it('should pass through a pixel value as-is', () => {
        expect(resolveCssSize('250px')).toBe('250px');
    });

    it('should pass through a vh value as-is', () => {
        expect(resolveCssSize('50vh')).toBe('50vh');
    });

    it('should return undefined when given undefined', () => {
        expect(resolveCssSize(undefined)).toBeUndefined();
    });

    it('should return empty string when given empty string', () => {
        expect(resolveCssSize('')).toBe('');
    });
});
