import { element } from './element';

describe(element, () => {
    const button = element('my-button');

    it('should generate element class without modifier', () => {
        expect(button('icon')).toBe('my-button__icon');
    });

    it('should generate element class with string modifier', () => {
        expect(button('icon', 'large')).toBe('my-button__icon my-button__icon--large');
    });

    it('should generate element class with object modifier', () => {
        expect(button('icon', { active: true })).toBe('my-button__icon my-button__icon--active');
    });

    it('should generate element class with multiple object modifiers', () => {
        const result = button('icon', { active: true, disabled: false, visible: true });
        expect(result).toContain('my-button__icon');
        expect(result).toContain('my-button__icon--active');
        expect(result).toContain('my-button__icon--visible');
        expect(result).not.toContain('my-button__icon--disabled');
    });

    it('should generate element class with additional classes', () => {
        expect(button('icon', undefined, 'custom-class')).toBe('my-button__icon custom-class');
    });

    it('should generate element class with modifier and additional classes', () => {
        const result = button('icon', 'large', 'custom-class');
        expect(result).toContain('my-button__icon');
        expect(result).toContain('my-button__icon--large');
        expect(result).toContain('custom-class');
    });

    it('should order classes correctly by default (modifier before additional)', () => {
        expect(button('icon', 'large', 'custom-class')).toBe('my-button__icon my-button__icon--large custom-class');
    });

    it('should handle array of additional classes', () => {
        const result = button('icon', 'large', ['class1', 'class2']);
        expect(result).toContain('my-button__icon');
        expect(result).toContain('my-button__icon--large');
        expect(result).toContain('class1');
        expect(result).toContain('class2');
    });

    it('should handle different element names', () => {
        expect(button('title')).toBe('my-button__title');
        expect(button('body')).toBe('my-button__body');
        expect(button('footer')).toBe('my-button__footer');
    });
});
