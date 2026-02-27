import { actionArea } from '.';

describe(actionArea, () => {
    it('should generate action area container class', () => {
        expect(actionArea()).toBe('lumx-action-area');
    });

    it('should generate action element class', () => {
        expect(actionArea.action()).toBe('lumx-action-area__action');
    });

    it('should generate action element with modifiers', () => {
        expect(actionArea.action({ 'focus-outset': true })).toBe(
            'lumx-action-area__action lumx-action-area__action--focus-outset',
        );
        expect(actionArea.action({ 'has-overlay': true, 'theme-dark': true })).toBe(
            'lumx-action-area__action lumx-action-area__action--has-overlay lumx-action-area__action--theme-dark',
        );
        expect(actionArea.action({ 'focus-inset': true, 'has-overlay': true, 'theme-light': true })).toBe(
            'lumx-action-area__action lumx-action-area__action--focus-inset lumx-action-area__action--has-overlay lumx-action-area__action--theme-light',
        );
    });

    it('should omit falsy modifiers', () => {
        expect(actionArea.action({ 'focus-inset': false, 'has-overlay': undefined })).toBe('lumx-action-area__action');
    });
});
