import { bem } from './index';

describe(bem, () => {
    const { block, element } = bem('button');

    describe('block', () => {
        it('should generate block class', () => {
            expect(block()).toBe('button');
        });

        it('should generate block class with modifiers', () => {
            expect(block({ active: true })).toBe('button button--active');
        });

        it('should generate block class with additional classes', () => {
            expect(block(['class-a'])).toBe('class-a button');
        });

        it('should generate block class with modifiers and additional classes', () => {
            expect(block({ active: true }, ['class-a'])).toBe('class-a button button--active');
        });
    });

    describe('element', () => {
        it('should generate element class', () => {
            expect(element('icon')).toBe('button__icon');
        });

        it('should generate element class with modifiers', () => {
            expect(element('icon', { active: true })).toBe('button__icon button__icon--active');
        });

        it('should generate element class with additional classes', () => {
            expect(element('icon', ['class-a'])).toBe('class-a button__icon');
        });

        it('should generate element class with modifiers and additional classes', () => {
            expect(element('icon', { active: true }, ['class-a'])).toBe('class-a button__icon button__icon--active');
        });
    });
});
