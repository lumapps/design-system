import { generateBEMClass } from './generateBEMClass';

describe(generateBEMClass, () => {
    describe('without modifiers or additional classes', () => {
        it('should return base class only', () => {
            expect(generateBEMClass('button')).toBe('button');
        });
    });

    describe('with string modifier', () => {
        it('should generate BEM class with string modifier', () => {
            expect(generateBEMClass('button', 'primary')).toBe('button button--primary');
        });
    });

    describe('with object modifier', () => {
        it('should generate BEM class with single object modifier', () => {
            expect(generateBEMClass('button', { active: true })).toBe('button button--active');
        });

        it('should generate BEM class with multiple object modifiers', () => {
            const result = generateBEMClass('button', { active: true, disabled: false, large: true });
            expect(result).toContain('button');
            expect(result).toContain('button--active');
            expect(result).toContain('button--large');
            expect(result).not.toContain('button--disabled');
        });

        it('should handle falsy values in object modifier', () => {
            const result = generateBEMClass('button', { active: false, disabled: undefined });
            expect(result).toBe('button');
        });
    });

    describe('with array modifier', () => {
        it('should pass through array as additional classes', () => {
            const result = generateBEMClass('button', ['custom-class', 'another-class']);
            expect(result).toContain('button');
            expect(result).toContain('custom-class');
            expect(result).toContain('another-class');
        });
    });

    describe('with additional classes', () => {
        it('should include single additional class', () => {
            expect(generateBEMClass('button', undefined, 'custom-class')).toBe('button custom-class');
        });

        it('should include array of additional classes', () => {
            const result = generateBEMClass('button', undefined, ['class1', 'class2']);
            expect(result).toContain('button');
            expect(result).toContain('class1');
            expect(result).toContain('class2');
        });
    });

    describe('with modifier and additional classes', () => {
        it('should include both modifier and additional class', () => {
            const result = generateBEMClass('button', 'primary', 'custom-class');
            expect(result).toContain('button');
            expect(result).toContain('button--primary');
            expect(result).toContain('custom-class');
        });

        it('should order modifier before additional classes by default', () => {
            expect(generateBEMClass('button', 'primary', 'custom-class')).toBe('button button--primary custom-class');
        });
    });

    describe('with element classes', () => {
        it('should work with element classes', () => {
            expect(generateBEMClass('button__icon', 'large')).toBe('button__icon button__icon--large');
        });

        it('should handle element with object modifier', () => {
            const result = generateBEMClass('button__icon', { active: true, disabled: false });
            expect(result).toContain('button__icon');
            expect(result).toContain('button__icon--active');
            expect(result).not.toContain('button__icon--disabled');
        });
    });

    describe('edge cases', () => {
        it('should handle empty object modifier', () => {
            expect(generateBEMClass('button', {})).toBe('button');
        });

        it('should handle empty array modifier', () => {
            expect(generateBEMClass('button', [])).toBe('button');
        });

        it('should handle undefined values', () => {
            expect(generateBEMClass('button', undefined, undefined)).toBe('button');
        });
    });
});
