import { block } from './block';

describe(block, () => {
    const button = block('my-button');

    it('should generate block class without modifier', () => {
        expect(button()).toBe('my-button');
    });

    it('should generate block class with string modifier', () => {
        expect(button('primary')).toBe('my-button my-button--primary');
    });

    it('should generate block class with object modifier', () => {
        expect(button({ active: true })).toBe('my-button my-button--active');
    });

    it('should generate block class with multiple object modifiers', () => {
        const result = button({ active: true, disabled: false, large: true });
        expect(result).toContain('my-button');
        expect(result).toContain('my-button--active');
        expect(result).toContain('my-button--large');
        expect(result).not.toContain('my-button--disabled');
    });

    it('should generate block class with additional classes', () => {
        expect(button(undefined, 'custom-class')).toBe('my-button custom-class');
    });

    it('should generate block class with modifier and additional classes', () => {
        const result = button('primary', 'custom-class');
        expect(result).toContain('my-button');
        expect(result).toContain('my-button--primary');
        expect(result).toContain('custom-class');
    });

    it('should order classes correctly by default (modifier before additional)', () => {
        expect(button('primary', 'custom-class')).toBe('my-button my-button--primary custom-class');
    });

    it('should handle array of additional classes', () => {
        const result = button('primary', ['class1', 'class2']);
        expect(result).toContain('my-button');
        expect(result).toContain('my-button--primary');
        expect(result).toContain('class1');
        expect(result).toContain('class2');
    });
});
