import { element } from './element';

describe(element, () => {
    it('should generate element class without modifier', () => {
        expect(element('my-button', 'icon')).toBe('my-button__icon');
    });

    it('should generate element class with object modifier', () => {
        expect(element('my-button', 'icon', { active: true })).toBe('my-button__icon my-button__icon--active');
    });

    it('should generate element class with multiple object modifiers', () => {
        const result = element('my-button', 'icon', { active: true, disabled: false, visible: true });
        expect(result).toContain('my-button__icon');
        expect(result).toContain('my-button__icon--active');
        expect(result).toContain('my-button__icon--visible');
        expect(result).not.toContain('my-button__icon--disabled');
    });
});
