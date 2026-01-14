import { block } from './block';

describe(block, () => {
    describe('without modifiers or additional classes', () => {
        it('should return base class only', () => {
            expect(block('button')).toBe('button');
        });
    });

    describe('with object modifier', () => {
        it('should handle empty object modifier', () => {
            expect(block('button', {})).toBe('button');
        });

        it('should generate BEM class with single object modifier', () => {
            expect(block('button', { active: true })).toBe('button button--active');
        });

        it('should generate BEM class with multiple object modifiers', () => {
            const result = block('button', { active: true, disabled: false, large: true });
            expect(result).toContain('button');
            expect(result).toContain('button--active');
            expect(result).toContain('button--large');
            expect(result).not.toContain('button--disabled');
        });

        it('should handle falsy values in object modifier', () => {
            const result = block('button', { active: false, disabled: undefined });
            expect(result).toBe('button');
        });
    });

    describe('with additional classes', () => {
        it('should append additional classes', () => {
            expect(block('button', ['class-a', 'class-b'])).toBe('class-a class-b button');
        });

        it('should append additional classes with modifiers', () => {
            expect(block('button', { active: true }, ['class-a'])).toBe('class-a button button--active');
        });
    });
});
