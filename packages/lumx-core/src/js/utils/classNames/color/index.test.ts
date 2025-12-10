import { ColorVariant } from '@lumx/core/js/constants';
import { color } from '.';

describe(color, () => {
    describe('font color', () => {
        it('should generate font color class with color and variant', () => {
            expect(color('font', 'dark', ColorVariant.L2)).toBe('lumx-color-font-dark-L2');
        });

        it('should generate font color class with default variant N when only color is provided', () => {
            expect(color('font', 'primary')).toBe('lumx-color-font-primary-N');
        });

        it('should handle color with variant in one string', () => {
            expect(color('font', 'primary-L2')).toBe('lumx-color-font-primary-L2');
        });

        it('should override variant when both are provided', () => {
            expect(color('font', 'primary-L2', ColorVariant.D1)).toBe('lumx-color-font-primary-D1');
        });
    });

    describe('background color', () => {
        it('should generate background color class with color and variant', () => {
            expect(color('background', 'dark', ColorVariant.L2)).toBe('lumx-color-background-dark-L2');
        });

        it('should generate background color class with default variant N when only color is provided', () => {
            expect(color('background', 'light')).toBe('lumx-color-background-light-N');
        });

        it('should handle color with variant in one string', () => {
            expect(color('background', 'primary-D2')).toBe('lumx-color-background-primary-D2');
        });
    });

    describe('color variants', () => {
        it('should handle all color variants', () => {
            expect(color('font', 'primary', ColorVariant.L1)).toBe('lumx-color-font-primary-L1');
            expect(color('font', 'primary', ColorVariant.L2)).toBe('lumx-color-font-primary-L2');
            expect(color('font', 'primary', ColorVariant.L3)).toBe('lumx-color-font-primary-L3');
            expect(color('font', 'primary', ColorVariant.L4)).toBe('lumx-color-font-primary-L4');
            expect(color('font', 'primary', ColorVariant.L5)).toBe('lumx-color-font-primary-L5');
            expect(color('font', 'primary', ColorVariant.L6)).toBe('lumx-color-font-primary-L6');
            expect(color('font', 'primary', ColorVariant.D1)).toBe('lumx-color-font-primary-D1');
            expect(color('font', 'primary', ColorVariant.D2)).toBe('lumx-color-font-primary-D2');
            expect(color('font', 'primary', ColorVariant.N)).toBe('lumx-color-font-primary-N');
        });
    });
});
