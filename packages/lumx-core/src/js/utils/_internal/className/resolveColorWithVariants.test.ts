import { resolveColorWithVariants } from './resolveColorWithVariants';

describe(resolveColorWithVariants, () => {
    it('should handle undefined color', () => {
        const result = resolveColorWithVariants(undefined);
        expect(result).toEqual([undefined, undefined]);
    });

    it('should handle undefined color with variant', () => {
        const result = resolveColorWithVariants(undefined, 'L2');
        expect(result).toEqual([undefined, 'L2']);
    });

    it('should handle color with undefined variant', () => {
        const result = resolveColorWithVariants('primary');
        expect(result).toEqual(['primary', undefined]);
    });

    it('should handle color & variant separated', () => {
        const result = resolveColorWithVariants('primary', 'L2');
        expect(result).toEqual(['primary', 'L2']);
    });

    it('should handle color with variant all in one', () => {
        const result = resolveColorWithVariants('primary-L2');
        expect(result).toEqual(['primary', 'L2']);
    });

    it('should override color variant with the given color variant', () => {
        const result = resolveColorWithVariants('primary-L2', 'D2');
        expect(result).toEqual(['primary', 'D2']);
    });
});
