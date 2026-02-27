import { Size } from '@lumx/core/js/constants';
import { spacing, spacings, margin, padding } from '.';

describe(spacing, () => {
    describe('with direction and size', () => {
        it('should generate spacing class with type, direction and size', () => {
            expect(spacing('padding', 'right', Size.regular)).toBe('lumx-spacing-padding-right-regular');
        });

        it('should generate spacing class for margin', () => {
            expect(spacing('margin', 'left', Size.big)).toBe('lumx-spacing-margin-left-big');
        });

        it('should handle all directions', () => {
            expect(spacing('padding', 'top', Size.regular)).toBe('lumx-spacing-padding-top-regular');
            expect(spacing('padding', 'right', Size.regular)).toBe('lumx-spacing-padding-right-regular');
            expect(spacing('padding', 'bottom', Size.regular)).toBe('lumx-spacing-padding-bottom-regular');
            expect(spacing('padding', 'left', Size.regular)).toBe('lumx-spacing-padding-left-regular');
            expect(spacing('padding', 'vertical', Size.regular)).toBe('lumx-spacing-padding-vertical-regular');
            expect(spacing('padding', 'horizontal', Size.regular)).toBe('lumx-spacing-padding-horizontal-regular');
        });
    });

    describe('with direction "all"', () => {
        it('should omit direction for "all"', () => {
            expect(spacing('padding', 'all', Size.regular)).toBe('lumx-spacing-padding-regular');
        });
    });

    describe('without direction', () => {
        it('should generate spacing class without direction', () => {
            expect(spacing('padding', undefined, Size.regular)).toBe('lumx-spacing-padding-regular');
        });
    });

    describe('without size', () => {
        it('should generate spacing class without size', () => {
            expect(spacing('padding', 'right')).toBe('lumx-spacing-padding-right');
        });

        it('should generate spacing class without direction and size', () => {
            expect(spacing('padding')).toBe('lumx-spacing-padding');
        });
    });

    describe('with size null', () => {
        it('should append "-none" when size is null', () => {
            expect(spacing('padding', 'right', null)).toBe('lumx-spacing-padding-right-none');
        });

        it('should append "-none" without direction when size is null', () => {
            expect(spacing('padding', undefined, null)).toBe('lumx-spacing-padding-none');
        });
    });

    describe('with different sizes', () => {
        it('should handle all size values', () => {
            expect(spacing('padding', 'right', Size.tiny)).toBe('lumx-spacing-padding-right-tiny');
            expect(spacing('padding', 'right', Size.regular)).toBe('lumx-spacing-padding-right-regular');
            expect(spacing('padding', 'right', Size.big)).toBe('lumx-spacing-padding-right-big');
            expect(spacing('padding', 'right', Size.huge)).toBe('lumx-spacing-padding-right-huge');
        });
    });
});

describe(spacings, () => {
    it('should generate multiple spacing classes', () => {
        const result = spacings([
            { type: 'padding', direction: 'right', size: Size.regular },
            { type: 'margin', direction: 'left', size: Size.big },
        ]);
        expect(result).toContain('lumx-spacing-padding-right-regular');
        expect(result).toContain('lumx-spacing-margin-left-big');
    });

    it('should handle single spacing configuration', () => {
        const result = spacings([{ type: 'padding', direction: 'top', size: Size.tiny }]);
        expect(result).toBe('lumx-spacing-padding-top-tiny');
    });

    it('should handle spacing without direction', () => {
        const result = spacings([{ type: 'padding', size: Size.regular }]);
        expect(result).toBe('lumx-spacing-padding-regular');
    });

    it('should handle spacing with null size', () => {
        const result = spacings([{ type: 'padding', direction: 'top', size: null }]);
        expect(result).toBe('lumx-spacing-padding-top-none');
    });

    it('should handle empty array', () => {
        const result = spacings([]);
        expect(result).toBe('');
    });

    it('should handle multiple spacings with various configurations', () => {
        const result = spacings([
            { type: 'padding', direction: 'top', size: Size.regular },
            { type: 'margin', direction: 'bottom', size: Size.big },
            { type: 'padding', size: Size.tiny },
        ]);
        expect(result).toContain('lumx-spacing-padding-top-regular');
        expect(result).toContain('lumx-spacing-margin-bottom-big');
        expect(result).toContain('lumx-spacing-padding-tiny');
    });
});

describe('shorthand overloads', () => {
    describe(spacing, () => {
        it('should accept (type, size) as shorthand for (type, "all", size)', () => {
            expect(spacing('padding', Size.regular)).toBe('lumx-spacing-padding-regular');
            expect(spacing('margin', Size.big)).toBe('lumx-spacing-margin-big');
        });

        it('should produce the same result as the explicit form', () => {
            expect(spacing('padding', Size.regular)).toBe(spacing('padding', 'all', Size.regular));
            expect(spacing('margin', Size.tiny)).toBe(spacing('margin', 'all', Size.tiny));
        });

        it('should handle null size in shorthand form', () => {
            expect(spacing('padding', null)).toBe('lumx-spacing-padding-none');
        });

        it('should still work with direction and size', () => {
            expect(spacing('padding', 'right', Size.regular)).toBe('lumx-spacing-padding-right-regular');
        });
    });

    describe(margin, () => {
        it('should accept (size) as shorthand for ("all", size)', () => {
            expect(margin(Size.regular)).toBe('lumx-spacing-margin-regular');
            expect(margin(Size.big)).toBe('lumx-spacing-margin-big');
            expect(margin(Size.tiny)).toBe('lumx-spacing-margin-tiny');
            expect(margin(Size.medium)).toBe('lumx-spacing-margin-medium');
            expect(margin(Size.huge)).toBe('lumx-spacing-margin-huge');
        });

        it('should produce the same result as the explicit form', () => {
            expect(margin(Size.regular)).toBe(margin('all', Size.regular));
        });

        it('should handle null size in shorthand form', () => {
            expect(margin(null)).toBe('lumx-spacing-margin-none');
        });

        it('should still work with direction and size', () => {
            expect(margin('right', Size.regular)).toBe('lumx-spacing-margin-right-regular');
        });
    });

    describe(padding, () => {
        it('should accept (size) as shorthand for ("all", size)', () => {
            expect(padding(Size.regular)).toBe('lumx-spacing-padding-regular');
            expect(padding(Size.big)).toBe('lumx-spacing-padding-big');
            expect(padding(Size.tiny)).toBe('lumx-spacing-padding-tiny');
            expect(padding(Size.medium)).toBe('lumx-spacing-padding-medium');
            expect(padding(Size.huge)).toBe('lumx-spacing-padding-huge');
        });

        it('should produce the same result as the explicit form', () => {
            expect(padding(Size.regular)).toBe(padding('all', Size.regular));
        });

        it('should handle null size in shorthand form', () => {
            expect(padding(null)).toBe('lumx-spacing-padding-none');
        });

        it('should still work with direction and size', () => {
            expect(padding('right', Size.regular)).toBe('lumx-spacing-padding-right-regular');
        });
    });
});
